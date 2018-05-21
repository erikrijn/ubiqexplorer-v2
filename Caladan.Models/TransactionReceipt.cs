using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Caladan.Models
{
    /// <summary>
    /// TransactionReceipt class.
    /// </summary>
    public class TransactionReceipt
    {
        public ObjectId Id { get; set; }

        [BsonElement("transaction_hash")]
        public string TransactionHash { get; set; }

        [BsonElement("transaction_index")]
        public ulong TransactionIndex { get; set; }

        [BsonElement("block_hash")]
        public string BlockHash { get; set; }

        [BsonElement("block_number")]
        public ulong BlockNumber { get; set; }

        [BsonElement("from")]
        public string From { get; set; }

        [BsonElement("logsBloom")]
        public string LogsBloom { get; set; }

        [BsonElement("root")]
        public string Root { get; set; }

        [BsonElement("to")]
        public string To { get; set; }

        [BsonElement("cumulative_gas_used")]
        public ulong CumulativeGasUsed { get; set; }

        [BsonElement("gas_used")]
        public ulong GasUsed { get; set; }

        [BsonElement("contract_address")]
        public string ContractAddress { get; set; }

        [BsonElement("logs")]
        public BsonArray Logs { get; set; }
    }
}
