using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Text;

namespace Caladan.Models
{
    public class BlockSyncRequest
    {
        public ObjectId Id { get; set; }

        [BsonElement("block_number")]
        public ulong BlockNumber { get; set; }

        [BsonElement("processed")]
        public bool Processed { get; set; }
    }
}
