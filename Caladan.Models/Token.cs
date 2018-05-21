using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Text;

namespace Caladan.Models
{
    public class Token
    {
        public ObjectId Id { get; set; }

        [BsonElement("standard")]
        public string Standard { get; set; }

        [BsonElement("name")]
        public string Name { get; set; }

        [BsonElement("address")]
        public string Address { get; set; }

        [BsonElement("symbol")]
        public string Symbol { get; set; }

        [BsonElement("cmc_name")]
        public string CmcName { get; set; }

        [BsonElement("abi")]
        public string Abi { get; set; }

        [BsonElement("decimals")]
        public int Decimals { get; set; }

        [BsonElement("show_on_account_page")]
        public bool ShowOnAccountPage { get; set; }

        [BsonElement("logo")]
        public string Logo { get; set; }

        [BsonElement("website")]
        public string Website { get; set; }

        [BsonElement("description")]
        public string Description { get; set; }
    }
}
