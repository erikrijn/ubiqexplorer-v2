using System;
using System.Collections.Generic;
using System.Text;

namespace Caladan.NodeServices.Web3.Models.Node
{
    public class TransactionReceipt
    {
        public string blockHash { get; set; }
        public string blockNumber { get; set; }
        public string contractAddress { get; set; }
        public string cumulativeGasUsed { get; set; }
        public string from { get; set; }
        public string gasUsed { get; set; }
        public Log[] logs { get; set; }
        public string logsBloom { get; set; }
        public string root { get; set; }
        public string to { get; set; }
        public string transactionHash { get; set; }
        public string transactionIndex { get; set; }
    }

    public class Log
    {
        public string address { get; set; }
        public string[] topics { get; set; }
        public string data { get; set; }
        public string blockNumber { get; set; }
        public string transactionIndex { get; set; }
        public string transactionHash { get; set; }
        public string blockHash { get; set; }
        public string logIndex { get; set; }
        public bool removed { get; set; }
    }
}
