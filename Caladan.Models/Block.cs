using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;

namespace Caladan.Models
{
    /// <summary>
    /// Block class.
    /// </summary>
    public class Block
    {
        public ObjectId Id { get; set; }

        [BsonElement("block_number")]
        public ulong BlockNumber { get; set; }

        [BsonElement("hash")]
        public string Hash { get; set; }

        [BsonElement("parent_hash")]
        public string ParentHash { get; set; }

        [BsonElement("nonce")]
        public string Nonce { get; set; }

        [BsonElement("sha3_uncles")]
        public string Sha3Uncles { get; set; }

        [BsonElement("logs_bloom")]
        public string LogsBloom { get; set; }

        [BsonElement("transactions_root")]
        public string TransactionsRoot { get; set; }

        [BsonElement("state_root")]
        public string StateRoot { get; set; }

        [BsonElement("miner")]
        public string Miner { get; set; }

        [BsonElement("difficulty")]
        public ulong Difficulty { get; set; }

        [BsonElement("total_difficulty")]
        public ulong TotalDifficulty { get; set; }

        [BsonElement("extra_data")]
        public string ExtraData { get; set; }

        [BsonElement("size")]
        public ulong Size { get; set; }

        [BsonElement("gas_limit")]
        public ulong GasLimit { get; set; }

        [BsonElement("gas_used")]
        public ulong GasUsed { get; set; }

        [BsonElement("number_of_transactions")]
        public int NumberOfTransactions { get; set; }

        [BsonIgnore]
        public Transaction[] Transactions { get; set; }

        [BsonElement("timestamp")]
        public ulong Timestamp { get; set; }

        [BsonIgnore]
        public DateTime Created
        {
            get
            {
                var created = new DateTime(1970, 1, 1, 0, 0, 0, 0, System.DateTimeKind.Utc);
                created = created.AddSeconds(Timestamp).ToLocalTime();
                return created;

            }
        }

        [BsonIgnore]
        public string MinerName { get; set; }
    }
}
