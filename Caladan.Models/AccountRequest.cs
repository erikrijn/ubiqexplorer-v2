using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;

namespace Caladan.Models
{
    /// <summary>
    /// AccountRequest class.
    /// </summary>
    public class AccountRequest
    {
        public ObjectId Id { get; set; }

        [BsonElement("address")]
        public string Address { get; set; }

        [BsonElement("balance")]
        public double Balance { get; set; }

        [BsonElement("ip_address")]
        public string IpAddress { get; set; }

        [BsonElement("requested_on")]
        public DateTime RequestedOn { get; set; }
    }
}
