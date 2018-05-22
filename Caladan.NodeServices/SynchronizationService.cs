using Caladan.NodeServices.Helpers;
using Caladan.NodeServices.Web3;
using Caladan.Repositories;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Caladan.Models;
using Microsoft.Extensions.Configuration;

namespace Caladan.NodeServices
{
    public class SynchronizationService : IDisposable
    {
        private bool _disposed;

        private MongoRepository<BlockSyncRequest> _blockSyncRequestRepository;
        private MongoRepository<Block> _blockRepository;
        private MongoRepository<Transaction> _transactionRepository;
        private MongoRepository<TransactionReceipt> _transactionReceiptRepository;
        private MongoRepository<Price> _priceRepository;
        private MongoRepository<Token> _tokenRepository;
        private BlockService _blockService;
        private TransactionService _transactionService;
        private Price _currentPrice;
        private IConfigurationRoot _configuration;

        private int _batchTime = 0;
        private int _batchSize = 128;
        private readonly int _batchTarget = 10000;
        private int _cpuMaxThreads = 4;

        public SynchronizationService()
        {
            _blockSyncRequestRepository = new MongoRepository<Models.BlockSyncRequest>();
            _blockRepository = new MongoRepository<Models.Block>();
            _transactionRepository = new MongoRepository<Models.Transaction>();
            _transactionReceiptRepository = new MongoRepository<Models.TransactionReceipt>();
            _tokenRepository = new MongoRepository<Token>();
            _priceRepository = new MongoRepository<Price>();

            var builder = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true);
            var configuration = builder.Build();
            _configuration = configuration;

            var cpuMaxThreadsCfgValue = configuration["MaxIndexingCpuThreads"];
            if (!string.IsNullOrEmpty(cpuMaxThreadsCfgValue))
                _cpuMaxThreads = int.Parse(cpuMaxThreadsCfgValue);

            var nodesCfgValue = configuration["AppSettings:Nodes"];
            if (string.IsNullOrEmpty(nodesCfgValue))
                throw new Exception("Configuration value for 'Nodes' cannot be empty.");

            var nodes = nodesCfgValue.Contains(',') ? nodesCfgValue.Split(',').ToList() : new List<string>() { nodesCfgValue };
            _blockService = new BlockService(nodes);
            _transactionService = new TransactionService(nodes);

            Console.WriteLine($"Setting the maximum thread count to {_cpuMaxThreads}.");
        }

        public async Task GetNewBlockSyncRequests()
        {
            var blockNumber = await _blockService.GetBlockNumberFromNodeAsync();

            Console.WriteLine($"Latest block number {blockNumber} found.");

            using (var blockSyncRequestRepository = new MongoRepository<BlockSyncRequest>())
            {
                var orderByIndex = Builders<BlockSyncRequest>.Sort.Descending("block_number");
                var latestBlockSync = await blockSyncRequestRepository.GetAsync(null, orderByIndex);

                var newBlockSyncs = new List<BlockSyncRequest>();
                for (var i = latestBlockSync?.BlockNumber + 1 ?? 0; i <= blockNumber; i++)
                {
                    var blockSync = new BlockSyncRequest()
                    {
                        BlockNumber = i,
                        Processed = false
                    };
                    newBlockSyncs.Add(blockSync);
                }

                Console.WriteLine($"Saving {newBlockSyncs.Count} new block sync requests.");

                if (newBlockSyncs.Count > 0)
                {
                    var saveBlockSyncRequestsOperations = newBlockSyncs.Split(10000);
                    var blockSyncRequestSaveTasks = saveBlockSyncRequestsOperations.Select(SaveBlockSyncRequests).ToList();

                    await Task.WhenAll(blockSyncRequestSaveTasks);
                }
            }
        }

        public async Task SynchronizeNewBlocksAsync(List<BlockSyncRequest> blockSyncRequests)
        {
            _currentPrice = await _priceRepository.GetAsync(x => x.Symbol == _configuration["AppSettings:MainCurrencySymbol"], x => x.LastUpdatedTimestamp, true);
            if (_currentPrice != null && _currentPrice.LastUpdated < DateTime.UtcNow.AddHours(-12))
                _currentPrice = null;

            var processed = 0;

            var getBlockOperations = blockSyncRequests.Take(_batchSize).ToList();
            while (getBlockOperations.Count > 0)
            {
                var sw = new Stopwatch();
                sw.Start();

                using (var throttler = new SemaphoreSlim(_cpuMaxThreads))
                {
                    var tasks = getBlockOperations.Select(async getBlockOperation =>
                    {
                        await throttler.WaitAsync();
                        try
                        {
                            await SyncBlockAsync(getBlockOperation);
                        }
                        finally
                        {
                            throttler.Release();
                        }
                    });

                    await Task.WhenAll(tasks);
                }

                sw.Stop();

                Console.WriteLine($"[{DateTime.UtcNow}] indexed {_batchSize} blocks in {sw.ElapsedMilliseconds} ms. [{getBlockOperations.Last().BlockNumber}]");

                _batchTime = (int)sw.ElapsedMilliseconds;
                if (_batchTime < _batchTarget)
                    _batchSize = (int)decimal.Round(_batchSize * decimal.Divide(_batchTarget, _batchTime));
                else
                    _batchSize = (int)decimal.Round(_batchSize / decimal.Divide(_batchTime, _batchTarget));

                if (_batchSize <= (_cpuMaxThreads / 2))
                    _batchSize = _cpuMaxThreads / 2;

                processed = processed + getBlockOperations.Count;
                getBlockOperations = blockSyncRequests.Skip(processed).Take(_batchSize).ToList();
            }
        }

        private async Task SyncBlockAsync(BlockSyncRequest blockSyncRequest)
        {
            var blockBuilder = Builders<Block>.Filter;
            var blockFilter = blockBuilder.Where(x => x.BlockNumber == blockSyncRequest.BlockNumber);
            var excistingBlocks = await _blockRepository.FindAsync(blockFilter, null);
            var blockExists = excistingBlocks.Count() > 0;

            Web3.Models.DTOs.Block block;
            try
            {
                block = await _blockService.GetBlockFromNodeAsync(blockSyncRequest.BlockNumber);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error getting block {blockSyncRequest.BlockNumber} from the node.");
                return;
            }

            if (block == null)
            {
                Console.WriteLine($"Block {blockSyncRequest.BlockNumber} could not be find in the node.");
                return;
            }

            var dbBlock = await _blockService.ConvertToDbBlockAsync(block, _tokenRepository, _priceRepository, _currentPrice);

            if (!blockExists)
                await SaveBlock(dbBlock);

            var transactions = new List<Transaction>();
            foreach (var transaction in dbBlock.Transactions)
            {
                var builder = Builders<Transaction>.Filter;
                var filter = builder.Where(x => x.TransactionHash == transaction.TransactionHash);
                var dbTransactions = await _transactionRepository.FindAsync(filter, null);
                var dbTransaction = dbTransactions.FirstOrDefault();
                if (dbTransaction == null)
                    transactions.Add(transaction);
                else
                {
                    dbTransaction.BlockHash = dbBlock.Hash;
                    dbTransaction.BlockNumber = dbBlock.BlockNumber;
                    dbTransaction.Timestamp = dbBlock.Timestamp;
                    transactions.Add(dbTransaction);
                }
            }

            await SaveTransactions(transactions);

            blockSyncRequest.Processed = true;
            await _blockSyncRequestRepository.SaveAsync(blockSyncRequest);
        }

        public async Task SyncPendingTransactionReceipts()
        {
            var builder = Builders<Transaction>.Filter;
            var filter = builder.Where(x => !x.ReceiptSynchronized);
            var transactions = await _transactionRepository.FindAsync(filter, null, _batchSize);
            while (transactions != null && transactions.Count() > 0)
            {
                var sw = new Stopwatch();
                sw.Start();

                using (var throttler = new SemaphoreSlim(_cpuMaxThreads))
                {
                    var tasks = transactions.Select(async syncTransactionReceipt =>
                    {
                        await throttler.WaitAsync();
                        try
                        {
                            await SyncTransactionReceiptAsync(syncTransactionReceipt);
                        }
                        catch (Exception ex)
                        {

                        }
                        finally
                        {
                            throttler.Release();
                        }
                    });

                    await Task.WhenAll(tasks);
                }

                sw.Stop();

                Console.WriteLine($"[{DateTime.UtcNow}] {_batchSize} transaction receipts in {sw.ElapsedMilliseconds} ms.");

                _batchTime = (int)sw.ElapsedMilliseconds;
                if (_batchTime < _batchTarget)
                    _batchSize = (int)decimal.Round(_batchSize * decimal.Divide(_batchTarget, _batchTime));
                else
                    _batchSize = (int)decimal.Round(_batchSize / decimal.Divide(_batchTime, _batchTarget));

                if (_batchSize <= (_cpuMaxThreads / 2))
                    _batchSize = _cpuMaxThreads / 2;

                transactions = await _transactionRepository.FindAsync(filter, null, _batchSize);
            }
        }

        private async Task SyncTransactionReceiptAsync(Transaction transaction)
        {
            if (transaction.TransactionHash.Length != 66 && transaction.TransactionHash.Length != 64)
                return;

            var transactionReceiptBuilder = Builders<TransactionReceipt>.Filter;
            var transactionReceiptFilter = transactionReceiptBuilder.Where(x => x.TransactionHash == transaction.TransactionHash);
            var excistingTransactionReceipts = await _transactionReceiptRepository.FindAsync(transactionReceiptFilter, null);
            var transactionReceiptExists = excistingTransactionReceipts.Count() > 0;

            if (!transactionReceiptExists)
            {
                var transactionReceipt = await _transactionService.GetTransactionReceiptFromNodeAsync(transaction.TransactionHash);
                if (transactionReceipt != null)
                {
                    var dbTransactionReceipt = _transactionService.ConvertToDbTransactionReceipt(transactionReceipt);
                    try
                    {
                        await _transactionReceiptRepository.SaveAsync(dbTransactionReceipt);
                    }
                    catch (Exception ex)
                    {
                        throw;
                    }
                }
            }

            transaction.ReceiptSynchronized = true;
            await _transactionRepository.SaveAsync(transaction);
        }

        private async Task SaveBlocks(IReadOnlyCollection<Block> blocksToSave)
        {
            if (blocksToSave == null) throw new ArgumentNullException(nameof(blocksToSave));
            if (blocksToSave.Count == 0)
                return;

            try
            {
                await _blockRepository.SaveMultipleAsync(blocksToSave);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                throw;
            }
        }

        private async Task SaveBlock(Block blockToSave)
        {
            if (blockToSave == null) throw new ArgumentNullException(nameof(blockToSave));

            try
            {
                await _blockRepository.SaveAsync(blockToSave);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                throw ex;
            }
        }

        private async Task SaveTransactions(IReadOnlyCollection<Transaction> transactionsToSave)
        {
            if (transactionsToSave == null) throw new ArgumentNullException(nameof(transactionsToSave));
            if (!transactionsToSave.Any())
                return;

            try
            {
                await _transactionRepository.SaveMultipleAsync(transactionsToSave);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                throw ex;
            }
        }

        private async Task SaveTransactionReceipts(IReadOnlyCollection<TransactionReceipt> transactionReceiptsToSave)
        {
            if (transactionReceiptsToSave == null) throw new ArgumentNullException(nameof(transactionReceiptsToSave));
            if (!transactionReceiptsToSave.Any())
                return;

            try
            {
                await _transactionReceiptRepository.SaveMultipleAsync(transactionReceiptsToSave);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                throw;
            }
        }

        protected virtual async Task SaveBlockSyncRequests(List<BlockSyncRequest> blockSyncRequestToSave)
        {
            if (!blockSyncRequestToSave.Any())
                return;

            try
            {
                await _blockSyncRequestRepository.SaveMultipleAsync(blockSyncRequestToSave);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                throw;
            }
        }

        #region Disposable implementation
        /// <summary>
        /// Performs application-defined tasks associated with freeing, releasing, or resetting unmanaged resources.
        /// </summary>
        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }

        ~SynchronizationService()
        {
            // Finalizer calls Dispose(false)  
            Dispose(false);
        }

        /// <summary>
        /// Releases unmanaged and - optionally - managed resources.
        /// </summary>
        /// <param name="disposing"><c>true</c> to release both managed and unmanaged resources; <c>false</c> to release only unmanaged resources.</param>
        protected virtual void Dispose(bool disposing)
        {
            if (_disposed)
                return;

            if (disposing)
            {
                _tokenRepository.Dispose();
                _blockRepository.Dispose();
                _blockSyncRequestRepository.Dispose();
                _priceRepository.Dispose();
                _tokenRepository.Dispose();
                _transactionReceiptRepository.Dispose();
                _transactionRepository.Dispose();
            }

            _blockService = null;

            _disposed = true;
        }
        #endregion
    }
}
