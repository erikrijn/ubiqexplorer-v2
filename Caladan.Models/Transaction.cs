using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Numerics;

namespace Caladan.Models
{
    /// <summary>
    /// Transaction class.
    /// </summary>
    public class Transaction
    {
        public ObjectId Id { get; set; }

        [BsonElement("transaction_hash")]
        public string TransactionHash { get; set; }

        [BsonElement("block_number")]
        public ulong BlockNumber { get; set; }

        [BsonElement("transaction_index")]
        public ulong TransactionIndex { get; set; }

        [BsonElement("block_hash")]
        public string BlockHash { get; set; }

        [BsonElement("from")]
        public string From { get; set; }

        [BsonElement("to")]
        public string To { get; set; }

        [BsonElement("gas")]
        public ulong Gas { get; set; }

        [BsonElement("gas_price")]
        public ulong GasPrice { get; set; }

        [BsonElement("value")]
        public string Value { get; set; }

        [BsonElement("decimals")]
        public int Decimals { get; set; }

        [BsonElement("symbol")]
        public string Symbol { get; set; }

        [BsonElement("input")]
        public string Input { get; set; }

        [BsonElement("nonce")]
        public ulong Nonce { get; set; }

        [BsonElement("timestamp")]
        public ulong Timestamp { get; set; }

        [BsonElement("price_usd")]
        public double PriceUsd { get; set; }

        [BsonElement("price_btc")]
        public double PriceBtc { get; set; }

        [BsonElement("price_eur")]
        public double PriceEur { get; set; }

        [BsonElement("is_token_transaction")]
        public bool IsTokenTransaction { get; set; }

        [BsonElement("original_transaction_hash")]
        public string OriginalTransactionHash { get; set; }

        [BsonElement("show_on_account_page")]
        public bool ShowOnAccountPage { get; set; }

        [BsonElement("receipt_synchronized")]
        public bool ReceiptSynchronized { get; set; }

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
        public TransactionReceipt Receipt { get; set; }
    }
}
