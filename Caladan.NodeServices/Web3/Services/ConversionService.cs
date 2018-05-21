using Caladan.NodeServices.Web3.Models.DTOs;
using MongoDB.Bson.IO;
using MongoDB.Bson.Serialization;
using MongoDB.Bson.Serialization.Serializers;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Caladan.NodeServices.Web3.Services
{
    public static class ConversionService
    {
        public static Block Convert(Models.Node.Block block)
        {
            return new Block()
            {
                BlockHash = block.hash,
                Difficulty = block.difficulty.HexToUlong(),
                ExtraData = block.extraData,
                GasLimit = block.gasLimit.HexToUlong(),
                GasUsed = block.gasUsed.HexToUlong(),
                LogsBloom = block.logsBloom,
                Miner = block.miner,
                Nonce = block.nonce,
                Number = block.number.HexToUlong(),
                ParentHash = block.parentHash,
                ReceiptsRoot = block.receiptsRoot,
                Sha3Uncles = block.sha3Uncles,
                Size = block.size.HexToUlong(),
                StateRoot = block.stateRoot,
                Timestamp = block.timestamp.HexToUlong(),
                TotalDifficulty = block.totalDifficulty.HexToUlong(),
                TransactionsRoot = block.transactionsRoot,
                Uncles = block.uncles.Length == 0 ? null : block.uncles,
                Transactions = block.transactions.Select(x => Convert(x)).ToArray()
            };
        }

        public static Transaction Convert(Models.Node.Transaction transaction)
        {
            return new Transaction()
            {
                BlockHash = transaction.blockHash,
                BlockNumber = string.IsNullOrEmpty(transaction.blockNumber) ? 0 : transaction.blockNumber.HexToUlong(),
                From = transaction.from,
                Gas = transaction.gas.HexToUlong(),
                GasPrice = transaction.gasPrice.HexToUlong(),
                Input = transaction.input,
                Nonce = transaction.nonce.HexToUlong(),
                To = transaction.to,
                TransactionHash = transaction.hash,
                TransactionIndex = transaction.transactionIndex.HexToUlong(),
                Value = transaction.value
            };
        }

        public static TransactionReceipt Convert(Models.Node.TransactionReceipt transactionReceipt)
        {
            try
            {
                var result = new TransactionReceipt()
                {
                    BlockNumber = transactionReceipt.blockNumber.HexToUlong(),
                    BlockHash = transactionReceipt.blockHash,
                    ContractAddress = transactionReceipt.contractAddress,
                    CumulativeGasUsed = transactionReceipt.cumulativeGasUsed.HexToUlong(),
                    GasUsed = transactionReceipt.gasUsed.HexToUlong(),
                    TransactionHash = transactionReceipt.transactionHash,
                    TransactionIndex = transactionReceipt.transactionIndex.HexToUlong(),
                    From = transactionReceipt.from,
                    LogsBloom = transactionReceipt.logsBloom,
                    Root = transactionReceipt.root,
                    To = transactionReceipt.to,
                    Logs = JArray.FromObject(transactionReceipt.logs)
                };



                return result;
            }
            catch (Exception ex)
            {
                throw;
            }
        }
    }
}
