using System;
using System.Collections.Generic;
using System.Globalization;
using System.Numerics;
using System.Text;

namespace Caladan.NodeServices.Web3
{
    public static class Extensions
    {
        public static ulong HexToUlong(this string input)
        {
            if (input == "0x0")
                return 0;

            if (input.StartsWith("0x"))
                input = input.Remove(0, 2);

            if (ulong.TryParse(input, NumberStyles.HexNumber, CultureInfo.InvariantCulture, out ulong result))
                return result;
            else
                throw new Exception("Input hex-string was not in a correct format.");
        }

        public static BigInteger HexToBigInt(this string input)
        {
            if (input == "0x0")
                return 0;

            if (input.StartsWith("0x"))
                input = input.Remove(0, 2);

            if (BigInteger.TryParse(input, NumberStyles.HexNumber, CultureInfo.InvariantCulture, out BigInteger result))
                return result;
            else
                throw new Exception("Input hex-string was not in a correct format.");
        }

        public static string ToHexString(this ulong input) => string.Format("0x{0:X}", input);

        public static double FromHexWei(this string input, int toUnit)
        {
            if (input == "0x0")
                return 0;
            if (input.StartsWith("0x"))
                input = input.Remove(0, 2);

            Nethereum.Hex.HexTypes.HexBigInteger value = new Nethereum.Hex.HexTypes.HexBigInteger(input);
            return (double)Nethereum.Web3.Web3.Convert.FromWei(value, toUnit);

            if (!BigInteger.TryParse(input, NumberStyles.AllowHexSpecifier, CultureInfo.InvariantCulture, out var result)) return 0;
            return (double)BigInteger.Divide(result,(toUnit == 0 ? 1 : (BigInteger)Math.Pow(10, toUnit)));
        }
    }
}
