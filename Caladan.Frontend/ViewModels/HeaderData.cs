using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Caladan.Frontend.ViewModels
{
    public class HeaderData : Base
    {
        public ulong LatestBlockNumber { get; set; }
        public double Price { get; set; }
        public double MarketCap { get; set; }
        public long AverageBlockTime { get; set; }
    }
}
