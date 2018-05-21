using Caladan.NodeServices.Web3.Models.DTOs;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Runtime.InteropServices;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Caladan.NodeServices.Web3.Services;
using Microsoft.Extensions.Configuration;
using RestSharp;
using MongoDB.Bson.Serialization;

namespace Caladan.NodeServices.Web3
{
    public class TransactionService : IDisposable
    {
        private bool _disposed;

        private List<string> _baseUrls;
        private string GetNodeUrl()
        {
            var rnd = new Random();
            var r = rnd.Next(_baseUrls.Count);
            return _baseUrls[r];
        }

        public TransactionService(List<string> nodes)
        {
            _baseUrls = nodes;
        }

        public async Task<Transaction> GetTransactionFromNodeAsync(string transactionHash)
        {
            var body = new Models.Node.JsonRpcBody("eth_getTransactionByHash", 1);
            body.AddParam(transactionHash);

            var client = new RestClient(GetNodeUrl());

            var request = new RestRequest(Method.POST);
            request.AddParameter("application/json; charset=utf-8", Newtonsoft.Json.JsonConvert.SerializeObject(body), ParameterType.RequestBody);
            request.RequestFormat = DataFormat.Json;

            var cancellationTokenSource = new CancellationTokenSource();
            var restResponse = await client.ExecuteTaskAsync(request, cancellationTokenSource.Token);

            if (restResponse.StatusCode == HttpStatusCode.OK)
            {
                var response = Newtonsoft.Json.JsonConvert.DeserializeObject<Models.Node.GetTransactionResponse>(restResponse.Content);
                return response.result != null ? ConversionService.Convert(response.result) : null;
            }
            else
            {
                if (string.IsNullOrEmpty(restResponse.Content))
                    throw new Exception($"Error posting to node: {restResponse.ErrorException}");
                else
                    throw new Exception($"Error posting to node: {restResponse.Content}");
            }
        }

        public async Task<Caladan.Models.Transaction> GetTransactionAsync(string transactionHash)
        {
            var transaction = await GetTransactionFromNodeAsync(transactionHash);
            return transaction != null ? ConvertToDbTransaction(transaction) : null;
        }

        public Caladan.Models.Transaction ConvertToDbTransaction(Transaction transaction, Caladan.Models.Price price = null, ulong timestamp = 0)
        {
            if (timestamp == 0)
                timestamp = (ulong)(DateTime.UtcNow.Subtract(new DateTime(1970, 1, 1))).TotalSeconds;

            return new Caladan.Models.Transaction()
            {
                BlockHash = transaction.BlockHash,
                BlockNumber = transaction.BlockNumber,
                From = transaction.From,
                Gas = transaction.Gas,
                GasPrice = transaction.GasPrice,
                Input = transaction.Input,
                Nonce = transaction.Nonce,
                To = transaction.To,
                TransactionHash = transaction.TransactionHash,
                TransactionIndex = transaction.TransactionIndex,
                Value = transaction.Value,
                Decimals = 18,
                Timestamp = timestamp,
                PriceBtc = price != null ? price.PriceBtc : 0,
                PriceEur = price != null ? price.PriceEur : 0,
                PriceUsd = price != null ? price.PriceUsd : 0,
                ShowOnAccountPage = true,
                ReceiptSynchronized = false
            };
        }

        public async Task<TransactionReceipt> GetTransactionReceiptFromNodeAsync(string transactionHash)
        {
            var body = new Models.Node.JsonRpcBody("eth_getTransactionReceipt", 1);
            body.AddParam(transactionHash);

            var client = new RestClient(GetNodeUrl());

            var request = new RestRequest(Method.POST);
            request.AddParameter("application/json; charset=utf-8", Newtonsoft.Json.JsonConvert.SerializeObject(body), ParameterType.RequestBody);
            request.RequestFormat = DataFormat.Json;

            var cancellationTokenSource = new CancellationTokenSource();
            var restResponse = await client.ExecuteTaskAsync(request, cancellationTokenSource.Token);

            if (restResponse.StatusCode == HttpStatusCode.OK)
            {
                var response = Newtonsoft.Json.JsonConvert.DeserializeObject<Models.Node.GetTransactionReceiptResponse>(restResponse.Content);
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

        public async Task<Caladan.Models.TransactionReceipt> GetTransactionReceiptAsync(string transactionHash)
        {
            var transactionReceipt = await GetTransactionReceiptFromNodeAsync(transactionHash);
            return ConvertToDbTransactionReceipt(transactionReceipt);
        }

        public Caladan.Models.TransactionReceipt ConvertToDbTransactionReceipt(TransactionReceipt transaction)
        {
            var result =  new Caladan.Models.TransactionReceipt()
            {
                BlockHash = transaction.BlockHash,
                BlockNumber = transaction.BlockNumber,
                From = transaction.From,
                To = transaction.To,
                TransactionHash = transaction.TransactionHash,
                TransactionIndex = transaction.TransactionIndex,
                ContractAddress = transaction.ContractAddress,
                CumulativeGasUsed = transaction.CumulativeGasUsed,
                GasUsed = transaction.GasUsed,
                LogsBloom = transaction.LogsBloom,
                Root = transaction.Root
            };

            if (transaction.Logs != null)
                using (var jsonReader = new MongoDB.Bson.IO.JsonReader(transaction.Logs.ToString()))
                {
                    var serializer = new MongoDB.Bson.Serialization.Serializers.BsonArraySerializer();
                    result.Logs = serializer.Deserialize(BsonDeserializationContext.CreateRoot(jsonReader));
                }

            return result;
        }

        public async Task<List<Transaction>> GetPendingTransactionsFromNodeAsync()
        {
            var body = new Models.Node.JsonRpcBody("eth_getBlockByNumber", 1);
            body.AddParam("pending");
            body.AddParam(true);

            var client = new RestClient(GetNodeUrl());

            var request = new RestRequest(Method.POST);
            request.AddParameter("application/json; charset=utf-8", Newtonsoft.Json.JsonConvert.SerializeObject(body), ParameterType.RequestBody);
            request.RequestFormat = DataFormat.Json;

            var cancellationTokenSource = new CancellationTokenSource();
            var restResponse = await client.ExecuteTaskAsync(request, cancellationTokenSource.Token);

            if (restResponse.StatusCode == HttpStatusCode.OK)
            {
                var response = Newtonsoft.Json.JsonConvert.DeserializeObject<Models.Node.GetBlockResponse>(restResponse.Content);

                var transactions = new List<Transaction>();
                if (response.result != null)
                {
                    foreach (var transaction in response.result.transactions)
                        transactions.Add(ConversionService.Convert(transaction));
                }
                return transactions;
            }
            else
            {
                if (string.IsNullOrEmpty(restResponse.Content))
                    throw new Exception($"Error posting to node: {restResponse.ErrorException}");
                else
                    throw new Exception($"Error posting to node: {restResponse.Content}");
            }
        }

        public async Task<List<Caladan.Models.Transaction>> GetPendingTransactionsAsync()
        {
            var dbTransactions = new List<Caladan.Models.Transaction>();

            var transactions = await GetPendingTransactionsFromNodeAsync();
            foreach (var transaction in transactions)
                dbTransactions.Add(ConvertToDbTransaction(transaction));
            return dbTransactions;
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

        ~TransactionService()
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
