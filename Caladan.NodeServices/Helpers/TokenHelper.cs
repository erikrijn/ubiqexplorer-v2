using Caladan.Models;
using Caladan.Repositories;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace Caladan.NodeServices.Helpers
{
    public class TokenHelper
    {
        public async Task<TokenTransaction> GetTokenData(Web3.Models.DTOs.Transaction transaction, MongoRepository<Token> tokenRepository, MongoRepository<Price> priceRepository)
        {
            var input = transaction.Input;
            if (string.IsNullOrEmpty(input))
                return null;

            if (input.Length < 10)
                return null;

            var token = await GetToken(transaction, tokenRepository);
            if (token == null)
                return null;

            var price = await GetPriceAsync(token, priceRepository);

            var method = GetMethod(input.Substring(0, 10));
            if (string.IsNullOrEmpty(method))
                return null;

            var parameters = GetParameters(input.Substring(10));

            if (parameters.Length == 0)
                throw new Exception("No parameters found in the input.");

            TokenTransaction tokenTransaction = null;
            switch (method)
            {
                case "approve":
                    tokenTransaction = new TokenTransaction()
                    {
                        Method = method,
                        ContractAddress = token.Address,
                        Name = token.Name,
                        Symbol = token.Symbol,
                        From = transaction.From,
                        To = GetAddressFromInputParameter(parameters[0]),
                        Value = parameters[1],
                        Decimals = token.Decimals,
                        PriceBtc = price != null ? price.PriceBtc : 0,
                        PriceUsd = price != null ? price.PriceUsd : 0,
                        PriceEur = price != null ? price.PriceEur : 0,
                    };
                    break;
                case "transfer":
                    tokenTransaction = new TokenTransaction()
                    {
                        Method = method,
                        ContractAddress = token.Address,
                        Name = token.Name,
                        Symbol = token.Symbol,
                        From = transaction.From,
                        To = GetAddressFromInputParameter(parameters[0]),
                        Value = parameters[1],
                        Decimals = token.Decimals,
                        PriceBtc = price != null ? price.PriceBtc : 0,
                        PriceUsd = price != null ? price.PriceUsd : 0,
                        PriceEur = price != null ? price.PriceEur : 0,
                    };
                    break;
                case "transferFrom":
                    tokenTransaction = new TokenTransaction()
                    {
                        Method = method,
                        ContractAddress = token.Address,
                        Name = token.Name,
                        Symbol = token.Symbol,
                        From = GetAddressFromInputParameter(parameters[0]),
                        To = GetAddressFromInputParameter(parameters[1]),
                        Value = parameters[2],
                        Decimals = token.Decimals,
                        PriceBtc = price != null ? price.PriceBtc : 0,
                        PriceUsd = price != null ? price.PriceUsd : 0,
                        PriceEur = price != null ? price.PriceEur : 0,
                    };
                    break;
                case "sweep":
                    tokenTransaction = new TokenTransaction()
                    {
                        Method = method,
                        ContractAddress = GetAddressFromInputParameter(parameters[0]),
                        Name = token.Name,
                        Symbol = token.Symbol,
                        From = transaction.To,
                        To = transaction.From,
                        Value = parameters[1],
                        Decimals = token.Decimals,
                        PriceBtc = price != null ? price.PriceBtc : 0,
                        PriceUsd = price != null ? price.PriceUsd : 0,
                        PriceEur = price != null ? price.PriceEur : 0,
                    };
                    break;
                case "mint":
                    tokenTransaction = new TokenTransaction()
                    {
                        Method = method,
                        ContractAddress = token.Address,
                        Name = token.Name,
                        Symbol = token.Symbol,
                        From = token.Address,
                        To = GetAddressFromInputParameter(parameters[0]),
                        Value = parameters[1],
                        Decimals = token.Decimals,
                        PriceBtc = price != null ? price.PriceBtc : 0,
                        PriceUsd = price != null ? price.PriceUsd : 0,
                        PriceEur = price != null ? price.PriceEur : 0,
                    };
                    break;
            }

            return tokenTransaction;
        }

        private async Task<Price> GetPriceAsync(Token token, MongoRepository<Price> priceRepository)
        {
            return await priceRepository.GetAsync(x => x.Symbol == token.Symbol, x => x.LastUpdatedTimestamp, true);
        }

        private async Task<Token> GetToken(Web3.Models.DTOs.Transaction transaction, MongoRepository<Token> tokenRepository)
        {
            return await tokenRepository.GetAsync(x => x.Address == transaction.To);
        }

        private string GetMethod(string opCode)
        {
            var method = Constants.Erc20OpCodes.FirstOrDefault(x => x.Key == opCode).Value;
            return method;
        }

        private string[] GetParameters(string input)
        {
            var matchList = Regex.Matches(input, ".{1,64}");
            var parameters = matchList.Cast<Match>().Select(match => match.Value).ToArray();
            return parameters;
        }

        public string GetAddressFromInputParameter(string parameter)
        {
            if (parameter.Length != 64)
                throw new Exception($"Parameter {parameter} is invalid.");
            return HexPrefix(parameter.Substring(24));
        }

        public string HexPrefix(string input)
        {
            if (!input.StartsWith("0x"))
                return $"0x{input}";
            return input;
        }

        private ulong ToUlong(string input)
        {
            if (!ulong.TryParse(input, NumberStyles.HexNumber, CultureInfo.InvariantCulture, out ulong result))
                ulong.TryParse(input, out result);
            return result;
        }
    }
}
