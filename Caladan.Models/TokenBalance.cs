using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Caladan.Models
{
    public class TokenBalance
    {
        public string Name { get; set; }
        public string Address { get; set; }
        public string Symbol { get; set; }
        public string Abi { get; set; }
        public int Decimals { get; set; }
        public double Balance { get; set; }
        public string Logo { get; set; }
    }
}
