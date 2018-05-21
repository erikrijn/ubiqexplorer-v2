using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Numerics;
using System.Text;

namespace Caladan.NodeServices.Web3.Models.DTOs
{
    public class Transaction
    {
        [JsonProperty(PropertyName = "hash")]
        public string TransactionHash { get; set; }

        [JsonProperty(PropertyName = "transactionIndex")]
        public ulong TransactionIndex { get; set; }

        [JsonProperty(PropertyName = "blockHash")]
        public string BlockHash { get; set; }

        [JsonProperty(PropertyName = "blockNumber")]
        public ulong BlockNumber { get; set; }

        [JsonProperty(PropertyName = "from")]
        public string From { get; set; }

        [JsonProperty(PropertyName = "to")]
        public string To { get; set; }

        [JsonProperty(PropertyName = "gas")]
        public ulong Gas { get; set; }

        [JsonProperty(PropertyName = "gasPrice")]
        public ulong GasPrice { get; set; }

        [JsonProperty(PropertyName = "value")]
        public string Value { get; set; }

        [JsonProperty(PropertyName = "input")]
        public string Input { get; set; }

        [JsonProperty(PropertyName = "nonce")]
        public ulong Nonce { get; set; }
    }
}
