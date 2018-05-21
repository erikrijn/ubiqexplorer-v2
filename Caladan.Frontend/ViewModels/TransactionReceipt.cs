namespace Caladan.Frontend.ViewModels
{
    public class TransactionReceipt
    {
        public string TransactionHash { get; set; }
        public ulong TransactionIndex { get; set; }
        public string BlockHash { get; set; }
        public ulong BlockNumber { get; set; }
        public ulong CumulativeGasUsed { get; set; }
        public ulong GasUsed { get; set; }
        public string ContractAddress { get; set; }
        public object Logs { get; set; }
        public string From { get; set; }
        public string LogsBloom { get; set; }
        public string Root { get; set; }
        public string To { get; set; }
    }
}
