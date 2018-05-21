using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Caladan.Frontend.Models.Api
{
    public class Price
    {
        public string Name { get; set; }

        public string Symbol { get; set; }

        public int Rank { get; set; }

        public double PriceUsd { get; set; }

        public double PriceBtc { get; set; }

        public double VolumeUsd24h { get; set; }

        public double MarketCapUsd { get; set; }

        public double AvailableSupply { get; set; }

        public double TotalSupply { get; set; }

        public double PercentChange1h { get; set; }

        public double PercentChange24h { get; set; }

        public double PercentChange7d { get; set; }

        public ulong LastUpdatedTimestamp { get; set; }

        public double PriceEur { get; set; }

        public double VolumeEur24h { get; set; }

        public double MarketCapEur { get; set; }

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
