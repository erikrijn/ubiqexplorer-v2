using System;
using System.Collections.Generic;
using System.Text;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace Caladan.NodeServices.Web3.Models.DTOs
{
    public class TransactionReceipt
    {
        [JsonProperty(PropertyName = "transactionHash")]
        public string TransactionHash { get; set; }

        [JsonProperty(PropertyName = "transactionIndex")]
        public ulong TransactionIndex { get; set; }

        [JsonProperty(PropertyName = "blockHash")]
        public string BlockHash { get; set; }

        [JsonProperty(PropertyName = "blockNumber")]
        public ulong BlockNumber { get; set; }

        [JsonProperty(PropertyName = "from")]
        public string From { get; set; }

        [JsonProperty(PropertyName = "logsBloom")]
        public string LogsBloom { get; set; }

        [JsonProperty(PropertyName = "root")]
        public string Root { get; set; }

        [JsonProperty(PropertyName = "to")]
        public string To { get; set; }

        [JsonProperty(PropertyName = "cumulativeGasUsed")]
        public ulong CumulativeGasUsed { get; set; }

        [JsonProperty(PropertyName = "gasUsed")]
        public ulong GasUsed { get; set; }

        [JsonProperty(PropertyName = "contractAddress")]
        public string ContractAddress { get; set; }

        [JsonProperty(PropertyName = "logs")]
        public JArray Logs { get; set; }
    }
}
