using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Caladan.Frontend.ViewModels
{
    public class Account : Base
    {
        public string Address { get; set; }
        public string Name { get; set; }
        public string Url { get; set; }
        public double Balance { get; set; }
        public ulong LastSeenInBlock { get; set; }
        public int NumberOfTransactions { get; set; }
        public double BalanceBtc { get; set; }
        public double BalanceUsd { get; set; }
        public double BalanceEur { get; set; }
        public string Identicon { get; set; }
        public SimpleTransaction[] Transactions { get; set; }
        public TokenBalance[] Tokens { get; set; }
        public Block[] Blocks { get; set; }
    }
}
