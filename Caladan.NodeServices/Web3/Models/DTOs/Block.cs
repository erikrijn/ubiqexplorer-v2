using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace Caladan.NodeServices.Web3.Models.DTOs
{
    public class Block
    {
        [JsonProperty(PropertyName = "gasUsed")]
        public ulong GasUsed { get; set; }

        [JsonProperty(PropertyName = "gasLimit")]
        public ulong GasLimit { get; set; }

        [JsonProperty(PropertyName = "size")]
        public ulong Size { get; set; }

        [JsonProperty(PropertyName = "extraData")]
        public string ExtraData { get; set; }

        [JsonProperty(PropertyName = "totalDifficulty")]
        public ulong TotalDifficulty { get; set; }

        [JsonProperty(PropertyName = "difficulty")]
        public ulong Difficulty { get; set; }

        [JsonProperty(PropertyName = "miner")]
        public string Miner { get; set; }

        [JsonProperty(PropertyName = "receiptsRoot")]
        public string ReceiptsRoot { get; set; }

        [JsonProperty(PropertyName = "timestamp")]
        public ulong Timestamp { get; set; }

        [JsonProperty(PropertyName = "stateRoot")]
        public string StateRoot { get; set; }

        [JsonProperty(PropertyName = "logsBloom")]
        public string LogsBloom { get; set; }

        [JsonProperty(PropertyName = "sha3Uncles")]
        public string Sha3Uncles { get; set; }

        [JsonProperty(PropertyName = "nonce")]
        public string Nonce { get; set; }

        [JsonProperty(PropertyName = "parentHash")]
        public string ParentHash { get; set; }

        [JsonProperty(PropertyName = "sealFields")]
        public string[] SealFields { get; set; }

        [JsonProperty(PropertyName = "hash")]
        public string BlockHash { get; set; }

        [JsonProperty(PropertyName = "number")]
        public ulong Number { get; set; }

        [JsonProperty(PropertyName = "transactionsRoot")]
        public string TransactionsRoot { get; set; }

        [JsonProperty(PropertyName = "uncles")]
        public string[] Uncles { get; set; }

        [JsonProperty(PropertyName = "transactions")]
        public Transaction[] Transactions { get; set; }
    }
}
