using System;
using System.Collections.Generic;
using System.Text;

namespace Caladan.Models
{
    public class TokenTransaction
    {
        public string Method { get; set; }
        public string Name { get; set; }
        public string Symbol { get; set; }
        public string From { get; set; }
        public string To { get; set; }
        public string Value { get; set; }
        public int Decimals { get; set; }
        public string ContractAddress { get; set; }
        public double PriceUsd { get; set; }
        public double PriceBtc { get; set; }
        public double PriceEur { get; set; }
    }
}
 