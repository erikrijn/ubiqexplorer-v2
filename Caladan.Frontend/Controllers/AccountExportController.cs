using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Caladan.NodeServices.Web3;
using Caladan.Repositories;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;

namespace Caladan.Frontend.Controllers
{
    public class AccountExportController : Controller
    {
        [HttpGet]
        public async Task<FileResult> Get(string address, bool includeTokens = false)
        {
            Chilkat.Csv csv = new Chilkat.Csv
            {
                HasColumnNames = true
            };

            csv.SetColumnName(0, "Hash");
            csv.SetColumnName(1, "From");
            csv.SetColumnName(2, "To");
            csv.SetColumnName(3, "Value");
            csv.SetColumnName(4, "Symbol");
            csv.SetColumnName(5, "Timestamp");
            csv.SetColumnName(6, "Date");

            using (var transactionService = new MongoRepository<Caladan.Models.Transaction>())
            {
                var builder = Builders<Caladan.Models.Transaction>.Filter;
                var filter = builder.Where(x => x.From == address || x.To == address);
                var sort = Builders<Caladan.Models.Transaction>.Sort.Descending("block_number");
                var transactions = await transactionService.FindAsync(filter, sort);

                var i = 0;
                foreach (var transaction in transactions)
                {
                    if (!string.IsNullOrEmpty(transaction.Symbol) && !includeTokens)
                        continue;

                    csv.SetCell(i, 0, transaction.TransactionHash);
                    csv.SetCell(i, 1, transaction.From);
                    csv.SetCell(i, 2, transaction.To);
                    csv.SetCell(i, 3, transaction.To.ToLower() == address.ToLower() ? 
                        transaction.Value.FromHexWei(transaction.Decimals).ToString() : 
                        (transaction.Value.FromHexWei(transaction.Decimals) * -1).ToString());
                    csv.SetCell(i, 4, string.IsNullOrEmpty(transaction.Symbol) ? "UBQ" : transaction.Symbol);
                    csv.SetCell(i, 5, transaction.Timestamp.ToString());
                    csv.SetCell(i, 6, transaction.Created.ToString());

                    i++;
                }
            }

            string csvDoc = csv.SaveToString();
            var bytes = Encoding.ASCII.GetBytes(csvDoc);

            if (includeTokens)
                return File(bytes, "text/csv", $"{address}-withtokens.csv");
            return File(bytes, "text/csv", $"{address}.csv");
        }
    }
}