using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.SwaggerGen;
using System.Transactions;
using Nethereum.Web3;
using Caladan.NodeServices.Web3;
using Microsoft.Extensions.Configuration;
using Caladan.Repositories;
using MongoDB.Driver;

namespace Caladan.Frontend.Controllers.Api
{
    [Route("api/[controller]")]
    public class TransactionController : Controller
    {
        private IConfiguration _configuration;
        private List<string> _nodeUrls;
        public TransactionController(IConfiguration configuration)
        {
            _configuration = configuration;
            var nodesCfgValue = configuration["AppSettings:Nodes"];
            if (string.IsNullOrEmpty(nodesCfgValue))
                throw new Exception("Configuration value for 'Nodes' cannot be empty.");

            _nodeUrls = nodesCfgValue.Contains(',') ? nodesCfgValue.Split(',').ToList() : new List<string>() { nodesCfgValue };
        }

        /// <summary>
        /// Gets a transaction by the specified transaction hash.
        /// </summary>
        /// <param name="transactionHash">The transaction hash.</param>
        /// <returns></returns>
        [HttpGet("{transactionHash}")]
        [ProducesResponseType(typeof(Models.Api.Transaction), 200)]
        [SwaggerResponse(200, Type = typeof(Models.Api.Transaction))]
        public async Task<IActionResult> Get(string transactionHash)
        {
            using (var transactionService = new TransactionService(_nodeUrls))
            {
                Caladan.Models.Transaction transaction = null;
                try
                {
                    transaction = await transactionService.GetTransactionAsync(transactionHash);
                }
                catch (Exception ex)
                {
                    return StatusCode(500, ex.Message);
                }

                if (transaction == null)
                    return NotFound($"Transaction {transactionHash} could not be found.");

                var apiTransaction = new Models.Api.Transaction()
                {
                    BlockHash = transaction.BlockHash,
                    BlockNumber = (ulong)transaction.BlockNumber,
                    From = transaction.From,
                    Gas = (ulong)transaction.Gas,
                    GasPrice = (ulong)transaction.GasPrice,
                    Input = transaction.Input,
                    Nonce = (ulong)transaction.Nonce,
                    To = transaction.To,
                    TransactionHash = transaction.TransactionHash,
                    TransactionIndex = (ulong)transaction.TransactionIndex,
                    Value = transaction.Value.FromHexWei(transaction.Decimals),
                    Symbol = string.IsNullOrEmpty(transaction.Symbol) ? _configuration["AppSettings:MainCurrencySymbol"] : transaction.Symbol,
                    Timestamp = transaction.Timestamp
                };

                return Ok(apiTransaction);
            }
        }

        [HttpGet]
        [ProducesResponseType(typeof(Models.Api.TransactionList), 200)]
        [SwaggerResponse(200, Type = typeof(Models.Api.TransactionList))]
        public async Task<IActionResult> Get(string address, string symbol = null, int? pageNumber = 1, int? pageSize = 1000)
        {
            if (symbol != null && symbol.ToUpper() == _configuration["AppSettings:MainCurrencySymbol"])
                symbol = null;

            if (!string.IsNullOrWhiteSpace(symbol))
                symbol = symbol.ToUpper();

            pageNumber = pageNumber == 0 ? 1 : pageNumber;
            using (var transactionRepository = new MongoRepository<Caladan.Models.Transaction>())
            {
                var builder = Builders<Caladan.Models.Transaction>.Filter;
                var filter = builder.Where(x => (x.From == address.ToLower() || x.To == address.ToLower()) && x.ShowOnAccountPage && x.Symbol == symbol);
                var sort = Builders<Caladan.Models.Transaction>.Sort.Descending("block_number");

                var numberOfTransactions = transactionRepository.GetQueryable(x => (x.From == address.ToLower() || x.To == address.ToLower()) && x.ShowOnAccountPage && x.Symbol == symbol).Count();
                var transactions = await transactionRepository.FindAsync(filter, sort, pageSize, pageNumber == 1 ? 0 : ((pageNumber - 1) * pageSize));

                var result = new Models.Api.TransactionList()
                {
                    PageNumber = pageNumber.Value,
                    PageSize = pageSize.Value,
                    TotalCount = numberOfTransactions,
                    Transactions = transactions.Select(transaction => new Models.Api.Transaction()
                    {
                        BlockHash = transaction.BlockHash,
                        BlockNumber = transaction.BlockNumber,
                        From = transaction.From,
                        Gas = transaction.Gas,
                        GasPrice = transaction.GasPrice,
                        Input = transaction.Input,
                        Nonce = transaction.Nonce,
                        To = transaction.To,
                        TransactionHash = transaction.TransactionHash.Replace("tokenreceiver_", ""),
                        TransactionIndex = transaction.TransactionIndex,
                        Value = transaction.Value.FromHexWei(transaction.Decimals),
                        Symbol = string.IsNullOrEmpty(transaction.Symbol) ? _configuration["AppSettings:MainCurrencySymbol"] : transaction.Symbol,
                        Timestamp = transaction.Timestamp
                    }).ToArray()
                };

                return Ok(result);
            }
        }
    }
}