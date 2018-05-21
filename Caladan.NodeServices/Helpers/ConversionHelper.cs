using System;
using System.Collections.Generic;
using System.Text;

namespace Caladan.NodeServices.Helpers
{
    public static class ConversionHelper
    {
        public static double ConvertWei(ulong input, int toUnit)
        {
            return (double)Nethereum.Web3.Web3.Convert.FromWei(input, toUnit);
        }
    }
}
