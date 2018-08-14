using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Caladan.Frontend.Helpers;
using Caladan.NodeServices.Web3;
using Caladan.Repositories;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using MongoDB.Driver;

namespace Caladan.Frontend.Controllers
{
    [Route("internalapi/[controller]")]
    [ApiExplorerSettings(IgnoreApi = true)]
    public class BlockController : Controller
    {
        private IConfiguration _configuration;
        private MongoRepository<Caladan.Models.Transaction> _transactionRepository;
        private MongoRepository<Caladan.Models.Block> _blockRepository;
        
        public BlockController(IConfiguration configuration,
            MongoRepository<Caladan.Models.Transaction> transactionRepository,
            MongoRepository<Caladan.Models.Block> blockRepository)
        {
            _configuration = configuration;
            _transactionRepository = transactionRepository;
            _blockRepository = blockRepository;
        }

        [HttpGet("[action]")]
        public async Task<IActionResult> Get(ulong blockNumber)
        {
            var dbBlock = await _blockRepository.GetAsync(x => x.BlockNumber == blockNumber);

            var builder = Builders<Caladan.Models.Transaction>.Filter;
            var filter = builder.Where(x => x.BlockNumber == blockNumber && x.ShowOnAccountPage);
            var orderByIndex = Builders<Caladan.Models.Transaction>.Sort.Ascending("transaction_index");
            var dbTransactions = await _transactionRepository.GetMultipleAsync(filter, orderByIndex);

            return dbBlock == null ? Ok(new ViewModels.Block() { Found = false }) : Ok(new ViewModels.Block()
            {
                BlockNumber = dbBlock.BlockNumber,
                Hash = dbBlock.Hash,
                Miner = dbBlock.Miner,
                NumberOfTransactions = dbBlock.NumberOfTransactions,
                Difficulty = dbBlock.Difficulty,
                ExtraData = dbBlock.ExtraData,
                GasLimit = dbBlock.GasLimit,
                GasUsed = dbBlock.GasUsed,
                LogsBloom = dbBlock.LogsBloom,
                Nonce = dbBlock.Nonce,
                ParentHash = dbBlock.ParentHash,
                Sha3Uncles = dbBlock.Sha3Uncles,
                Size = dbBlock.Size,
                StateRoot = dbBlock.StateRoot,
                Timestamp = dbBlock.Timestamp,
                TotalDifficulty = dbBlock.TotalDifficulty,
                TransactionsRoot = dbBlock.TransactionsRoot,
                FoundOnFormatted = dbBlock.Created.ToString(),
                Transactions = dbTransactions.Select(x => new ViewModels.SimpleTransaction
                {
                    BlockNumber = x.BlockNumber,
                    Found = true,
                    From = x.From,
                    Gas = x.Gas,
                    GasPrice = x.GasPrice,
                    To = x.To,
                    TransactionHash = x.TransactionHash,
                    Value = x.Value.FromHexWei(x.Decimals),
                    Symbol = string.IsNullOrEmpty(x.Symbol) ? _configuration["AppSettings:MainCurrencySymbol"] : x.Symbol,
                    Timestamp = x.Timestamp,
                    ConfirmedOnFormatted = x.Created.ToString(),
                    OriginalTransactionHash = x.OriginalTransactionHash
                }).ToArray(),
                Found = true
            });
        }

        [HttpGet("[action]")]
        public async Task<IActionResult> GetLatestBlocks(int limit = 50)
        {
            var orderBy = Builders<Caladan.Models.Block>.Sort.Descending("block_number");
            var dbBlocks = await _blockRepository.FindAsync(null, orderBy, limit);

            return Ok(dbBlocks.Select(x => new ViewModels.Block
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
            }));
        }
    }
}