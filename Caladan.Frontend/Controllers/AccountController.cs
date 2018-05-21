using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Caladan.Frontend.Helpers;
using Caladan.NodeServices;
using Caladan.NodeServices.Web3;
using Caladan.Repositories;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using MongoDB.Driver;

namespace Caladan.Frontend.Controllers
{
    [Route("internalapi/[controller]")]
    [ApiExplorerSettings(IgnoreApi = true)]
    public class AccountController : Controller
    {
        private IConfiguration _configuration;
        private List<string> _nodeUrls;
        public AccountController(IConfiguration configuration)
        {
            _configuration = configuration;
            var nodesCfgValue = configuration["AppSettings:Nodes"];
            if (string.IsNullOrEmpty(nodesCfgValue))
                throw new Exception("Configuration value for 'Nodes' cannot be empty.");

            _nodeUrls = nodesCfgValue.Contains(',') ? nodesCfgValue.Split(',').ToList() : new List<string>() { nodesCfgValue };
        }

        [HttpGet("[action]")]
        public async Task<IActionResult> Get(string address, int pageNumber)
        {
            using (var blockRepository = new MongoRepository<Caladan.Models.Block>())
            using (var accountService = new AccountService(_nodeUrls))
            {
                var getAccount = accountService.GetAccountAsync(address, false, 25, true);

                var builder = Builders<Caladan.Models.Block>.Filter;
                var filter = builder.Where(x => x.Miner == address.ToLower());
                var orderBy = Builders<Caladan.Models.Block>.Sort.Descending("block_number");
                var getMinedBlocks = blockRepository.FindAsync(filter, orderBy, 200);

                await Task.WhenAll(getAccount, getMinedBlocks);

                var account = getAccount.Result;
                var minedBlocks = getMinedBlocks.Result;

                var base64Icon = "";
                if (account != null)
                {
                    var blockiesHelper = new Blockies(address.ToLower());
                    base64Icon = blockiesHelper.GetBase64Image(128);
                }

                return Ok(account == null ? new ViewModels.Account() { Found = false } : new ViewModels.Account()
                {
                    Address = account.Address,
                    Balance = account.Balance,
                    BalanceBtc = account.BalanceBtc,
                    BalanceEur = account.BalanceEur,
                    BalanceUsd = account.BalanceUsd,
                    Found = true,
                    LastSeenInBlock = account.LastSeenInBlock,
                    Name = account.Name,
                    NumberOfTransactions = account.NumberOfTransactions,
                    Identicon = base64Icon,
                    Transactions = account.Transactions.Select(x => new ViewModels.SimpleTransaction()
                    {
                        BlockNumber = x.BlockNumber,
                        Found = true,
                        From = x.From,
                        Gas = x.Gas,
                        GasPrice = x.GasPrice,
                        To = x.To,
                        TransactionHash = x.TransactionHash,
                        Value = x.Value.FromHexWei(x.Decimals),
                        Symbol = string.IsNullOrEmpty(x.Symbol) ? "UBQ" : x.Symbol,
                        Timestamp = x.Timestamp,
                        ConfirmedOnFormatted = x.Created.ToString(),
                        OriginalTransactionHash = x.OriginalTransactionHash
                    }).ToArray(),
                    Tokens = account.Tokens.OrderBy(x => x.Name).Select(x => new ViewModels.TokenBalance()
                    {
                        Address = x.Address,
                        Balance = x.Balance,
                        Name = x.Name,
                        Symbol = x.Symbol,
                        Logo = x.Logo
                    }).ToArray(),
                    Blocks = minedBlocks.Select(x => new ViewModels.Block()
                    {
                        BlockNumber = x.BlockNumber,
                        Hash = x.Hash,
                        Miner = x.Miner,
                        NumberOfTransactions = x.NumberOfTransactions,
                        Difficulty = x.Difficulty,
                        ExtraData = x.ExtraData,
                        GasLimit = x.GasLimit,
                        GasUsed = x.GasUsed,
                        LogsBloom = x.LogsBloom,
                        Nonce = x.Nonce,
                        ParentHash = x.ParentHash,
                        Sha3Uncles = x.Sha3Uncles,
                        Size = x.Size,
                        StateRoot = x.StateRoot,
                        Timestamp = x.Timestamp,
                        TotalDifficulty = x.TotalDifficulty,
                        TransactionsRoot = x.TransactionsRoot,
                        Found = true
                    }).ToArray(),
                    Url = $"/account/{account.Address}"
                });
            }
        }

        [HttpGet("[action]")]
        public async Task<IActionResult> GetTransactions(string address, int pageNumber)
        {
            pageNumber = pageNumber == 0 ? 1 : pageNumber;
            using (var transactionService = new MongoRepository<Caladan.Models.Transaction>())
            {
                var builder = Builders<Caladan.Models.Transaction>.Filter;
                var filter = builder.Where(x => (x.From == address.ToLower() || x.To == address.ToLower()) && x.ShowOnAccountPage);
                var sort = Builders<Caladan.Models.Transaction>.Sort.Descending("block_number");
                var transactions = await transactionService.FindAsync(filter, sort, 15, pageNumber == 1 ? 0 : ((pageNumber - 1) * 15));

                var result = transactions.Select(x => new ViewModels.SimpleTransaction()
                {
                    BlockNumber = x.BlockNumber,
                    Found = true,
                    From = x.From,
                    Gas = x.Gas,
                    GasPrice = x.GasPrice,
                    To = x.To,
                    TransactionHash = x.TransactionHash,
                    Value = x.Value.FromHexWei(x.Decimals),
                    Symbol = string.IsNullOrEmpty(x.Symbol) ? "UBQ" : x.Symbol,
                    Timestamp = x.Timestamp,
                    ConfirmedOnFormatted = x.Created.ToString(),
                    OriginalTransactionHash = x.OriginalTransactionHash
                });

                return Ok(result);
            }
        }



    }
}