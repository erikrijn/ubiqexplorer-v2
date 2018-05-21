using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Caladan.Frontend.ViewModels
{
    public class SimpleTransaction : Base
    {
        public string TransactionHash { get; set; }
        public string OriginalTransactionHash { get; set; }
        public ulong BlockNumber { get; set; }
        public string From { get; set; }
        public string To { get; set; }
        public ulong Gas { get; set; }
        public ulong GasPrice { get; set; }
        public double Value { get; set; }
        public string Symbol { get; set; }
        public ulong Timestamp { get; set; }
        public string ConfirmedOnFormatted { get; set; }
        public string Url => $"/transaction/{TransactionHash}";
    }
}
