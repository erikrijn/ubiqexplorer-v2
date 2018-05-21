using System;

namespace Caladan.Frontend.ViewModels
{
    public class Transaction : Base
    {
        public string TransactionHash { get; set; }
        public string OriginalTransactionHash { get; set; }
        public ulong BlockNumber { get; set; }
        public ulong TransactionIndex { get; set; }
        public string BlockHash { get; set; }
        public string From { get; set; }
        public string To { get; set; }
        public ulong Gas { get; set; }
        public ulong GasPrice { get; set; }
        public ulong GasUsed{ get; set; }
        public double Fee { get; set; }
        public double Value { get; set; }
        public string Symbol { get; set; }
        public string Input { get; set; }
        public ulong Nonce { get; set; }
        public ulong Timestamp { get; set; }
        public double PriceUsd { get; set; }
        public double PriceBtc { get; set; }
        public double PriceEur { get; set; }
        public string ConfirmedOnFormatted { get; set; }
        public ulong Confirmations { get; set; }
        public string Url => $"/transaction/{TransactionHash}";
        public TransactionReceipt Receipt { get; set; }
        public string ReceiptRaw { get; set; }
        public string Raw { get; set; }
    }
}
