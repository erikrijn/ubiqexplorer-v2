using Caladan.Models;
using Caladan.Repositories;
using System;
using System.Threading.Tasks;
using MongoDB.Driver;
using System.Diagnostics;
using Caladan.NodeServices;
using System.Collections.Generic;
using System.Linq;
using Microsoft.Extensions.Configuration;
using System.IO;

namespace Caladan.Indexer
{
    class Program
    {
        public static async Task Main(string[] args)
        {
            var builder = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true);
            var configuration = builder.Build();

            var sw = new Stopwatch();
            sw.Start();

            using (var mservice = new MongoRepository<Token>())
            {
                var tokens = mservice.GetAllAsync().Result;
                foreach (var token in tokens)
                {
                    if (string.IsNullOrEmpty(token.CmcName)) continue;
                    Console.WriteLine($"Getting the current price for token {token.Symbol}.");
                    try
                    {
                        Pricing.PriceService.GetPriceLastAsync(token.CmcName, token.Symbol).Wait();
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine($"Error while getting the current price for token {token.Symbol}. {ex.Message}");
                    }
                }
                Console.WriteLine($"Getting current the current price for the main currency.");
                try
                {
                    Pricing.PriceService.GetPriceLastAsync(configuration["AppSettings:MainCurrencyName"].ToLower(), configuration["AppSettings:MainCurrencySymbol"]).Wait();
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Error while getting the current price for the main currency. {ex.Message}");
                }
            }

            try
            {
                var synchronizationService = new SynchronizationService();
                await synchronizationService.GetNewBlockSyncRequests();
                await ProcessPendingBlockSyncRequests();
                await synchronizationService.SyncPendingTransactionReceipts();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
            }
            finally
            {
                sw.Stop();
            }

            Console.WriteLine($"Finished in {sw.ElapsedMilliseconds} ms.");
        }

        public static async Task ProcessPendingBlockSyncRequests()
        {
            var builder = Builders<Models.BlockSyncRequest>.Filter;
            var filter = builder.Where(x => !x.Processed);

            IEnumerable<BlockSyncRequest> blockSyncRequests;
            using (var _blockSyncRequestRepository = new MongoRepository<BlockSyncRequest>())
            {
                blockSyncRequests = await _blockSyncRequestRepository.FindAsync(filter, null);
            }

            var synchronizationService = new SynchronizationService();
            await synchronizationService.SynchronizeNewBlocksAsync(blockSyncRequests.ToList());
        }
    }
}
