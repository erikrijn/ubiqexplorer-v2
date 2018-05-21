using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using Newtonsoft.Json;
using System;

namespace Caladan.Models
{
    /// <summary>
    /// Price class.
    /// </summary>
    public class Price
    {
        [JsonIgnore]
        public ObjectId Id { get; set; }

        [BsonElement("name")]
        [JsonProperty(PropertyName = "name")]
        public string Name { get; set; }

        [BsonElement("symbol")]
        [JsonProperty(PropertyName = "symbol")]
        public string Symbol { get; set; }

        [BsonElement("rank")]
        [JsonProperty(PropertyName = "rank")]
        public int Rank { get; set; }

        [BsonElement("price_usd")]
        [JsonProperty(PropertyName = "price_usd")]
        public double PriceUsd { get; set; }

        [BsonElement("price_btc")]
        [JsonProperty(PropertyName = "price_btc")]
        public double PriceBtc { get; set; }

        [BsonElement("24h_volume_usd")]
        [JsonProperty(PropertyName = "24h_volume_usd")]
        public double VolumeUsd24h { get; set; }

        [BsonElement("market_cap_usd")]
        [JsonProperty(PropertyName = "market_cap_usd")]
        public double MarketCapUsd { get; set; }

        [BsonElement("available_supply")]
        [JsonProperty(PropertyName = "available_supply")]
        public double AvailableSupply { get; set; }

        [BsonElement("total_supply")]
        [JsonProperty(PropertyName = "total_supply")]
        public double TotalSupply { get; set; }

        [BsonElement("percent_change_1h")]
        [JsonProperty(PropertyName = "percent_change_1h")]
        public double PercentChange1h { get; set; }

        [BsonElement("percent_change_24h")]
        [JsonProperty(PropertyName = "percent_change_24h")]
        public double PercentChange24h { get; set; }

        [BsonElement("percent_change_7d")]
        [JsonProperty(PropertyName = "percent_change_7d")]
        public double PercentChange7d { get; set; }

        [BsonElement("last_updated")]
        [JsonProperty(PropertyName = "last_updated")]
        public ulong LastUpdatedTimestamp { get; set; }

        [BsonElement("price_eur")]
        [JsonProperty(PropertyName = "price_eur")]
        public double PriceEur { get; set; }

        [BsonElement("24h_volume_eur")]
        [JsonProperty(PropertyName = "24h_volume_eur")]
        public double VolumeEur24h { get; set; }

        [BsonElement("market_cap_eur")]
        [JsonProperty(PropertyName = "market_cap_eur")]
        public double MarketCapEur { get; set; }

        [BsonIgnore]
        [JsonIgnore]
        public DateTime LastUpdated
        {
            get
            {
                var created = new DateTime(1970, 1, 1, 0, 0, 0, 0, System.DateTimeKind.Utc);
                created = created.AddSeconds(LastUpdatedTimestamp).ToLocalTime();
                return created;

            }
        }
    }

}
