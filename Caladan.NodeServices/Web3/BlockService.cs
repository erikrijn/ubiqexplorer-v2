using Caladan.NodeServices.Web3.Services;
using Newtonsoft.Json;
using RestSharp;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Caladan.Models;
using Caladan.NodeServices.Helpers;
using Caladan.Repositories;
using Microsoft.Extensions.Configuration;
using Block = Caladan.NodeServices.Web3.Models.DTOs.Block;

namespace Caladan.NodeServices.Web3
{
    public class BlockService : IDisposable
    {
        private bool _disposed;

        private List<string> _baseUrls;
        private string GetNodeUrl()
        {
            var rnd = new Random();
            int r = rnd.Next(_baseUrls.Count);
            return _baseUrls[r];
        }

        public BlockService(List<string> nodes)
        {
            _baseUrls = nodes;
        }

        public async Task<ulong> GetBlockNumberFromNodeAsync()
        {
            var body = new Models.Node.JsonRpcBody("eth_blockNumber", 1);

            var client = new RestClient(GetNodeUrl());
            var request = new RestRequest(Method.POST);
            request.AddParameter("application/json; charset=utf-8", JsonConvert.SerializeObject(body), ParameterType.RequestBody);
            request.RequestFormat = DataFormat.Json;

            var cancellationTokenSource = new CancellationTokenSource();
            var restResponse = await client.ExecuteTaskAsync(request, cancellationTokenSource.Token);

            if (restResponse.StatusCode == HttpStatusCode.OK)
            {
                var response = JsonConvert.DeserializeObject<Models.Node.GetBlockNumberResponse>(restResponse.Content);
                return response.result.HexToUlong();
            }
            else
            {
                if (string.IsNullOrEmpty(restResponse.Content))
                    throw new Exception($"Error posting to node: {restResponse.ErrorException}");
                else
                    throw new Exception($"Error posting to node: {restResponse.Content}");
            }
        }

        public async Task<Models.DTOs.Block> GetBlockFromNodeAsync(ulong blockNumber)
        {
            var body = new Models.Node.JsonRpcBody("eth_getBlockByNumber", 1);
            body.AddParam(blockNumber.ToHexString());
            body.AddParam(true);

            var client = new RestClient(GetNodeUrl());

            var request = new RestRequest(Method.POST);
            request.AddParameter("application/json; charset=utf-8", JsonConvert.SerializeObject(body), ParameterType.RequestBody);
            request.RequestFormat = DataFormat.Json;

            var cancellationTokenSource = new CancellationTokenSource();
            var restResponse = await client.ExecuteTaskAsync(request, cancellationTokenSource.Token);

            if (restResponse.StatusCode == HttpStatusCode.OK)
            {
                var response = JsonConvert.DeserializeObject<Models.Node.GetBlockResponse>(restResponse.Content);
                return ConversionService.Convert(response.result);
            }
            else
            {
                if (string.IsNullOrEmpty(restResponse.Content))
                    throw new Exception($"Error posting to node: {restResponse.ErrorException}");
                else
                    throw new Exception($"Error posting to node: {restResponse.Content}");
            }
        }

        public async Task<Caladan.Models.Block> ConvertToDbBlockAsync(Block block, MongoRepository<Token> tokenRepository, MongoRepository<Price> priceRepository, Price price = null)
        {
            //  var currentTimestamp = (ulong)(DateTime.UtcNow.Subtract(new DateTime(1970, 1, 1))).TotalSeconds;
            if (price != null && block.Timestamp < price.LastUpdatedTimestamp - 21600)
                price = null;

            var transactions = new List<Transaction>();
            var transactionService = new TransactionService(_baseUrls);
            var tokenHelper = new TokenHelper();

            foreach (var transaction in block.Transactions)
            {
                var dbTransaction = transactionService.ConvertToDbTransaction(transaction, price, block.Timestamp);

                var dbTokenTransaction = await tokenHelper.GetTokenData(transaction, tokenRepository, priceRepository);
                if (dbTokenTransaction != null && (!string.IsNullOrEmpty(dbTokenTransaction.Value) && !dbTokenTransaction.Value.Equals("0x0")))
                {
                    var tokenPrice = await priceRepository.GetAsync(x => x.Symbol == dbTokenTransaction.Symbol, x => x.LastUpdatedTimestamp, true);
                    if (tokenPrice != null && block.Timestamp < tokenPrice.LastUpdatedTimestamp - 21600)
                        tokenPrice = null;

                    transactions.Add(new Transaction()
                    {
                        BlockHash = transaction.BlockHash,
                        BlockNumber = transaction.BlockNumber,
                        From = dbTokenTransaction.From,
                        Gas = transaction.Gas,
                        GasPrice = transaction.GasPrice,
                        Input = transaction.Input,
                        Nonce = transaction.Nonce,
                        To = dbTokenTransaction.To,
                        TransactionHash = $"tokenreceiver_{transaction.TransactionHash}",
                        TransactionIndex = transaction.TransactionIndex,
                        Value = dbTokenTransaction.Value,
                        Decimals = dbTokenTransaction.Decimals,
                        Timestamp = block.Timestamp,
                        PriceBtc = tokenPrice != null ? tokenPrice.PriceBtc : 0,
                        PriceEur = tokenPrice != null ? tokenPrice.PriceEur : 0,
                        PriceUsd = tokenPrice != null ? tokenPrice.PriceUsd : 0,
                        IsTokenTransaction = true,
                        OriginalTransactionHash = transaction.TransactionHash,
                        Symbol = dbTokenTransaction.Symbol,
                        ShowOnAccountPage = true,
                        ReceiptSynchronized = true
                    });

                    dbTransaction.ShowOnAccountPage = false;
                }

                transactions.Add(dbTransaction);
            }

            return new Caladan.Models.Block()
            {
                BlockNumber = block.Number,
                NumberOfTransactions = block.Transactions.Length,
                Hash = block.BlockHash,
                Nonce = block.Nonce,
                ParentHash = block.ParentHash,
                Difficulty = block.Difficulty,
                ExtraData = block.ExtraData,
                LogsBloom = block.LogsBloom,
                Miner = block.Miner,
                Sha3Uncles = block.Sha3Uncles,
                StateRoot = block.StateRoot,
                TotalDifficulty = block.TotalDifficulty,
                TransactionsRoot = block.TransactionsRoot,
                GasLimit = block.GasLimit,
                GasUsed = block.GasUsed,
                Size = block.Size,
                Timestamp = block.Timestamp,
                Transactions = transactions.ToArray()
            };
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

        ~BlockService()
        {
            // Finalizer calls Dispose(false)  
            Dispose(false);
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

            _baseUrls = null;

            _disposed = true;
        }
        #endregion
    }
}
