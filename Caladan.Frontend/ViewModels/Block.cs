using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Caladan.Frontend.ViewModels
{
    public class Block : Base
    {
        public ulong BlockNumber { get; set; }
        public string Hash { get; set; }
        public string Miner { get; set; }
        public int NumberOfTransactions { get; set; }
        public string ParentHash { get; set; }
        public string Nonce { get; set; }
        public string Sha3Uncles { get; set; }
        public string LogsBloom { get; set; }
        public string TransactionsRoot { get; set; }
        public string StateRoot { get; set; }
        public ulong Difficulty { get; set; }
        public ulong TotalDifficulty { get; set; }
        public string ExtraData { get; set; }
        public ulong Size { get; set; }
        public ulong GasLimit { get; set; }
        public ulong GasUsed { get; set; }
        public ulong Timestamp { get; set; }
        public string FoundOnFormatted { get; set; }
        public string Url
        {
            get
            {
                return $"/block/{BlockNumber}";
            }
        }
        public SimpleTransaction[] Transactions { get; set; }
    }
}
