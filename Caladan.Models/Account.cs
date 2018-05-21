using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;

namespace Caladan.Models
{
    /// <summary>
    /// Account class.
    /// </summary>
    public class Account
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="Account"/> class.
        /// </summary>
        public Account()
        {

        }

        /// <summary>
        /// Initializes a new instance of the <see cref="Account"/> class.
        /// </summary>
        /// <param name="address">The address.</param>
        /// <param name="balance">The balance.</param>
        public Account(string address, double balance)
        {
            Address = address;
            Balance = balance;
        }

        public ObjectId Id { get; set; }

        [BsonElement("address")]
        public string Address { get; set; }

        [BsonElement("name")]
        public string Name { get; set; }

        [BsonElement("url")]
        public string Url { get; set; }

        [BsonElement("balance")]
        public double Balance { get; set; }

        [BsonElement("first_requested_on")]
        public DateTime FirstRequestedOn { get; set; }

        [BsonElement("last_updated_on")]
        public DateTime LastUpdatedOn { get; set; }

        [BsonIgnore]
        public Transaction[] Transactions { get; set; }

        [BsonIgnore]
        public ulong LastSeenInBlock { get; set; }

        [BsonIgnore]
        public int NumberOfTransactions { get; set; }

        [BsonIgnore]
        public double BalanceBtc { get; set; }

        [BsonIgnore]
        public double BalanceUsd { get; set; }

        [BsonIgnore]
        public double BalanceEur { get; set; }

        [BsonIgnore]
        public TokenBalance[] Tokens { get; set; }
    }
}
