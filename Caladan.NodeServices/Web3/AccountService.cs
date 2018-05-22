using Caladan.Models;
using Caladan.Repositories;
using MongoDB.Driver;
using Nethereum.Contracts.CQS;
using Nethereum.Web3;
using Newtonsoft.Json;
using RestSharp;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Numerics;
using System.Threading;
using System.Threading.Tasks;

namespace Caladan.NodeServices.Web3
{
    /// <summary>
    /// AccountService class.
    /// </summary>
    /// <seealso cref="System.IDisposable" />
    public class AccountService : IDisposable
    {
        private bool _disposed;

        private List<string> _baseUrls;
        private string GetNodeUrl()
        {
            var rnd = new Random();
            var r = rnd.Next(_baseUrls.Count);
            return _baseUrls[r];
        }

        private Nethereum.Web3.Web3 _web3;
        private MongoRepository<Transaction> _mongoTransactionService;
        private MongoRepository<Account> _mongoAccountService;
        private MongoRepository<AccountRequest> _mongoAccountRequestService;

        /// <summary>
        /// Initializes a new instance of the <see cref="AccountService"/> class.
        /// </summary>
        public AccountService(List<string> nodes)
        {
            _baseUrls = nodes;
            _web3 = new Nethereum.Web3.Web3(GetNodeUrl());
            _mongoTransactionService = new MongoRepository<Transaction>();
            _mongoAccountService = new MongoRepository<Account>();
            _mongoAccountRequestService = new MongoRepository<AccountRequest>();
        }


        /// <summary>
        /// Gets an account asynchronous.
        /// </summary>
        /// <param name="address">The address.</param>
        /// <param name="fromIpAddress">From ip address.</param>
        /// <param name="includeransactions">if set to <c>true</c> [includeransactions].</param>
        /// <param name="maxNumberOfTransactions">The maximum number of transactions.</param>
        /// <returns></returns>
        public async Task<Account> GetAccountAsync(string address, string defaultSymbol, bool includeTransactions = true, int maxNumberOfTransactions = 25, bool includePrices = true)
        {
            address = address.ToLower();

            var getBalance = GetBalanceFromNodeAsync(address);

            var fromTransactionsQuery = _mongoTransactionService.GetQueryable(x => x.From == address && x.ShowOnAccountPage, x => x.BlockNumber, true);
            var noOfFromTransactions = fromTransactionsQuery.Count();

            var toTransactionsQuery = _mongoTransactionService.GetQueryable(x => x.To == address && x.ShowOnAccountPage, x => x.BlockNumber, true);
            var noOfToTransactions = toTransactionsQuery.Count();

            var noOfTransactions = noOfFromTransactions + noOfToTransactions;
            if (noOfTransactions == 0)
                return null;

            var tokenRepository = new MongoRepository<Token>();
            var tokens = await tokenRepository.GetAllAsync();

            var transactions = new List<Transaction>();
            if (includeTransactions)
            {
                var fromTransactions = fromTransactionsQuery.Take(maxNumberOfTransactions).ToList();
                var toTransactions = toTransactionsQuery.Take(maxNumberOfTransactions).ToList();

                transactions.AddRange(fromTransactions);
                transactions.AddRange(toTransactions);

                transactions = transactions.OrderByDescending(x => x.BlockNumber).Take(maxNumberOfTransactions).ToList();
            }

            var getAccount = _mongoAccountService.GetAsync(x => x.Address == address);
            
            #region Get token balances
            var tokenBalances = tokens.Where(x => x.ShowOnAccountPage).Select(x => new TokenBalance()
            {
                Abi = x.Abi,
                Address = x.Address,
                Name = x.Name,
                Symbol = x.Symbol,
                Decimals = x.Decimals,
                Logo = x.Logo
            });

            var getTokenBalances = new List<Task<TokenBalance>>();
            foreach (var token in tokenBalances)
                getTokenBalances.Add(GetTokenBalanceAsync(token, address));
            #endregion

            await Task.WhenAll(getBalance, getAccount);
            await Task.WhenAll(getTokenBalances);

            var accountTokens = new List<TokenBalance>();
            foreach (var getTokenBalance in getTokenBalances)
            {
                if (getTokenBalance.Status == TaskStatus.RanToCompletion && getTokenBalance.Result.Balance > 0)
                    accountTokens.Add(getTokenBalance.Result);
            }

            var account = getAccount.Result;
            var balance = getBalance.Result;

            if (account == null)
                account = new Account(address, balance)
                {
                    FirstRequestedOn = DateTime.UtcNow,
                    Name = "",
                    Url = ""
                };
            else
            {
                account.LastUpdatedOn = DateTime.UtcNow;
                account.Balance = balance;
            }
            account.Transactions = transactions.ToArray();
            account.NumberOfTransactions = noOfTransactions;
            account.Tokens = accountTokens.ToArray();

            if (includePrices)
            {
                var priceRepository = new MongoRepository<Price>();
                var priceBuilder = Builders<Price>.Filter;
                var priceFilter = priceBuilder.Where(x => x.Symbol == defaultSymbol);
                var orderByPrice = Builders<Price>.Sort.Descending("last_updated");

                var lastPrice = await priceRepository.GetAsync(priceFilter, orderByPrice);
                if (lastPrice != null)
                {
                    account.BalanceBtc = account.Balance * lastPrice.PriceBtc;
                    account.BalanceUsd = account.Balance * lastPrice.PriceUsd;
                    account.BalanceEur = account.Balance * lastPrice.PriceEur;
                }
            }

            await _mongoAccountService.SaveAsync(account);

            return account;
        }

        public async Task<double> GetBalanceFromNodeAsync(string address, ulong blockNumber = 0)
        {
            var body = new Models.Node.JsonRpcBody("eth_getBalance", 1);
            body.AddParam(address);
            if (blockNumber == 0)
                body.AddParam("latest");
            else
                body.AddParam(blockNumber);

            var client = new RestClient(GetNodeUrl());

            var request = new RestRequest(Method.POST);
            request.AddParameter("application/json; charset=utf-8", JsonConvert.SerializeObject(body), ParameterType.RequestBody);
            request.RequestFormat = DataFormat.Json;

            var cancellationTokenSource = new CancellationTokenSource();
            var restResponse = await client.ExecuteTaskAsync(request, cancellationTokenSource.Token);

            if (restResponse.StatusCode == HttpStatusCode.OK)
            {
                var response = JsonConvert.DeserializeObject<Models.Node.GetBalanceResponse>(restResponse.Content);
                return (double)response.result.FromHexWei(18);
            }
            else
            {
                if (string.IsNullOrEmpty(restResponse.Content))
                    throw new Exception($"Error posting to node: {restResponse.ErrorException}");
                else
                    throw new Exception($"Error posting to node: {restResponse.Content}");
            }
        }

        public async Task<TokenBalance> GetTokenBalanceAsync(TokenBalance token, string address)
        {
            var tokenWithBalance = token;
            var contract = this._web3.Eth.GetContract(token.Abi, token.Address);
            var balanceInWei = await contract.GetFunction("balanceOf").CallAsync<BigInteger>(address);
            var balance = (double)BigInteger.Divide(balanceInWei, (BigInteger)(token.Decimals == 0 ? 1 : Math.Pow(10, token.Decimals)));
            tokenWithBalance.Balance = balance;
            return tokenWithBalance;
        }

        #region Disposable implementation
        /// <summary>
        /// Performs application-defined tasks associated with freeing, releasing, or resetting unmanaged resources.
        /// </summary>
        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }

        /// <summary>
        /// Releases unmanaged and - optionally - managed resources.
        /// </summary>
        /// <param name="disposing"><c>true</c> to release both managed and unmanaged resources; <c>false</c> to release only unmanaged resources.</param>
        protected virtual void Dispose(bool disposing)
        {
            if (_disposed)
                return;

            if (disposing)
            {

            }

            _web3 = null;

            _disposed = true;
        }
        #endregion
    }
}
