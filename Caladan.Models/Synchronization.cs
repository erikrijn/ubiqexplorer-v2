using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;

namespace Caladan.Models
{
    /// <summary>
    /// Synchronization class.
    /// </summary>
    public class Synchronization
    {
        public ObjectId Id { get; set; }

        [BsonElement("last_synchronization")]
        public DateTime LastSynchronization { get; set; }

        [BsonElement("last_block_number")]
        public ulong LastBlockNumber { get; set; }
    }
}
