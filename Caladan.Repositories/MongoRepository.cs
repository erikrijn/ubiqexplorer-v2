using Microsoft.Extensions.Configuration;
using MongoDB.Bson;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;

namespace Caladan.Repositories
{
    /// <summary>
    /// MongoDB repository class.
    /// </summary>
    /// <typeparam name="T"></typeparam>
    /// <seealso cref="Vorian.Backend.Database.Interfaces.IMongoService{T}" />
    /// <seealso cref="System.IDisposable" />
    public class MongoRepository<T> : IDisposable where T : class
    {
        private bool _disposed;
        private MongoClient _mongoClient { get; set; }
        private IMongoDatabase _mongoDatabase { get; set; }
        private IMongoCollection<T> _mongoCollection { get; set; }


        /// <summary>
        /// Initializes a new instance of the <see cref="MongoRepository{T}"/> class.
        /// </summary>
        public MongoRepository()
        {
            var builder = new ConfigurationBuilder()
                 .SetBasePath(Directory.GetCurrentDirectory())
                 .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true);

            var configuration = builder.Build();

            MongoCredential mongoCredential = null;
            if (!string.IsNullOrWhiteSpace(configuration["AppSettings:MongoDbUsername"]))
                mongoCredential = MongoCredential.CreateMongoCRCredential(configuration["AppSettings:MongoDbAuthDbName"], configuration["AppSettings:MongoDbUsername"], configuration["AppSettings:MongoDbPassword"]);

            var settings = new MongoClientSettings();
            settings.Server = new MongoServerAddress(configuration["AppSettings:MongoDbHost"], 27017);
            settings.MaxConnectionPoolSize = 25000;
            settings.WaitQueueSize = 25000;
            if (mongoCredential != null)
                settings.Credential = mongoCredential;

            _mongoClient = new MongoClient(settings);
            _mongoDatabase = _mongoClient.GetDatabase(configuration["AppSettings:MongoDbName"]);
            _mongoCollection = GetCollection();
        }

        /// <summary>
        /// Checks if a collections the exists.
        /// </summary>
        /// <param name="name">The name.</param>
        /// <returns></returns>
        private bool CollectionExists(string name) => _mongoDatabase.ListCollections(new ListCollectionsOptions { Filter = new BsonDocument("name", name.ToLower()) }).Any();

        /// <summary>
        /// Gets the collection.
        /// </summary>
        /// <returns></returns>
        private IMongoCollection<T> GetCollection() => _mongoDatabase.GetCollection<T>(typeof(T).Name.ToLower());

        /// <summary>
        /// Gets all asynchronous.
        /// </summary>
        /// <returns></returns>
        public async Task<IEnumerable<T>> GetAllAsync()
        {
            var result = new List<T>();

            using (var cursor = await _mongoCollection.FindAsync(new BsonDocument()))
                while (await cursor.MoveNextAsync())
                    result.AddRange(cursor.Current);

            return result;
        }

        /// <summary>
        /// Gets a single entity asynchronous.
        /// </summary>
        /// <param name="id">The identifier.</param>
        /// <returns></returns>
        public async Task<T> GetAsync(ObjectId id) => await _mongoCollection.Find<T>(new BsonDocument("_id", id)).FirstOrDefaultAsync();

        /// <summary>
        /// Gets a single entity asynchronous.
        /// </summary>
        /// <param name="filter">The filter.</param>
        /// <returns></returns>
        public async Task<T> GetAsync(FilterDefinition<T> filter) => await _mongoCollection.Find<T>(filter).FirstOrDefaultAsync();

        public async Task<T> GetAsync(FilterDefinition<T> filter, SortDefinition<T> orderby)
        {
            if (filter == null && orderby == null)
                return await _mongoCollection.Find(x => true).FirstOrDefaultAsync();
            if (filter != null && orderby == null)
                return await _mongoCollection.Find(filter).FirstOrDefaultAsync();
            if (filter == null && orderby != null)
                return await _mongoCollection.Find(x => true).Sort(orderby).FirstOrDefaultAsync();
            return await _mongoCollection.Find(filter).Sort(orderby).FirstOrDefaultAsync();
        }

        public async Task<IEnumerable<T>> GetMultipleAsync(FilterDefinition<T> filter, SortDefinition<T> orderby)
        {
            var result = new List<T>();

            var options = new FindOptions<T>
            {
                Sort = orderby
            };

            using (var cursor = await _mongoCollection.FindAsync(filter, options))
                while (await cursor.MoveNextAsync())
                {
                    var batch = cursor.Current;
                    foreach (var document in batch)
                        result.Add(document);
                }

            return result;
        }

        /// <summary>
        /// Gets a single entity asynchronous.
        /// </summary>
        /// <param name="filter">The filter.</param>
        /// <returns></returns>
        public async Task<T> GetAsync(Expression<Func<T, bool>> filter) => await Task.Run(() => { return _mongoCollection.AsQueryable<T>().Where(filter).FirstOrDefault(); });

        /// <summary>
        /// Gets a single asynchronous.
        /// </summary>
        /// <typeparam name="R"></typeparam>
        /// <param name="filter">The filter.</param>
        /// <param name="orderby">The sort order.</param>
        /// <returns></returns>
        public async Task<T> GetAsync<R>(Expression<Func<T, bool>> filter, Expression<Func<T, R>> orderby) => await GetAsync(filter, orderby, false);

        /// <summary>
        /// Gets a single entity asynchronous.
        /// </summary>
        /// <typeparam name="R"></typeparam>
        /// <param name="filter">The filter.</param>
        /// <param name="orderby">The sort order.</param>
        /// <param name="orderDescending">if set to <c>true</c> [order descending].</param>
        /// <returns></returns>
        public async Task<T> GetAsync<R>(Expression<Func<T, bool>> filter, Expression<Func<T, R>> orderby, bool orderDescending)
        {
            if (filter != null)
            {
                if (orderDescending)
                    return await Task.Run(() => { return _mongoCollection.AsQueryable<T>().Where(filter).OrderByDescending(orderby).FirstOrDefault(); });
                else
                    return await Task.Run(() => { return _mongoCollection.AsQueryable<T>().Where(filter).OrderBy(orderby).FirstOrDefault(); });
            }
            else
            {
                if (orderDescending)
                    return await Task.Run(() => { return _mongoCollection.AsQueryable<T>().OrderByDescending(orderby).FirstOrDefault(); });
                else
                    return await Task.Run(() => { return _mongoCollection.AsQueryable<T>().OrderBy(orderby).FirstOrDefault(); });
            }
        }

        /// <summary>
        /// Finds multiple entities asynchronous.
        /// </summary>
        /// <param name="filter">The filter.</param>
        /// <param name="orderby">The sort order.</param>
        /// <param name="take">Take n records.</param>
        /// <param name="skip">Skip n records.</param>
        /// <returns></returns>
        public async Task<IEnumerable<T>> FindAsync(FilterDefinition<T> filter, SortDefinition<T> orderby, int? take = null, int? skip = null)
        {
            if (filter == null && orderby == null)
                return await _mongoCollection.Find(x => true).Skip(skip).Limit(take).ToListAsync();
            if (filter != null && orderby == null)
                return await _mongoCollection.Find(filter).Skip(skip).Limit(take).ToListAsync();
            if (filter == null && orderby != null)
                return await _mongoCollection.Find(x => true).Skip(skip).Limit(take).Sort(orderby).ToListAsync();
            return await _mongoCollection.Find(filter).Skip(skip).Limit(take).Sort(orderby).ToListAsync();
        }

        /// <summary>
        /// Gets a queryable object for the collection.
        /// </summary>
        /// <param name="filter">The filter.</param>
        /// <returns></returns>
        public IQueryable<T> GetQueryable(Expression<Func<T, bool>> filter) => _mongoCollection.AsQueryable<T>().Where(filter);

        /// <summary>
        /// Gets a queryable object for the collection.
        /// </summary>
        /// <typeparam name="R"></typeparam>
        /// <param name="filter">The filter.</param>
        /// <param name="orderby">The sort order.</param>
        /// <param name="orderDescending">if set to <c>true</c> [order descending].</param>
        /// <returns></returns>
        public IQueryable<T> GetQueryable<R>(Expression<Func<T, bool>> filter, Expression<Func<T, R>> orderby, bool orderDescending)
        {
            if (orderDescending)
                return _mongoCollection.AsQueryable<T>().OrderByDescending(orderby).AsQueryable<T>().Where(filter);
            else
                return _mongoCollection.AsQueryable<T>().OrderBy(orderby).AsQueryable<T>().Where(filter);
        }

        /// <summary>
        /// Saves an entity asynchronous.
        /// </summary>
        /// <param name="entity">The entity.</param>
        /// <returns></returns>
        public async Task<T> SaveAsync(T entity)
        {
            var objectId = (ObjectId)typeof(T).GetProperty("Id").GetValue(entity);
            if (objectId == ObjectId.Empty)
                await _mongoCollection.InsertOneAsync(entity);
            else
                await _mongoCollection.ReplaceOneAsync(new BsonDocument("_id", objectId), entity);

            return entity;
        }

        /// <summary>
        /// Inserts multiple entities asynchronous.
        /// </summary>
        /// <param name="entities">The entities.</param>
        /// <returns></returns>
        public async Task<IEnumerable<T>> SaveMultipleAsync(IEnumerable<T> entities)
        {
            var toInsert = new List<T>();
            foreach (var entity in entities)
            {
                var objectId = (ObjectId)typeof(T).GetProperty("Id").GetValue(entity);
                if (objectId == ObjectId.Empty)
                    toInsert.Add(entity);
                else
                    await SaveAsync(entity);
            }

            if (toInsert.Count > 0)
            {
                await _mongoCollection.InsertManyAsync(toInsert);
            }

            return toInsert;
        }

        /// <summary>
        /// Deletes an entity asynchronous.
        /// </summary>
        /// <param name="entity">The entity.</param>
        /// <exception cref="Exception">The object id cannot be empty.</exception>
        public async Task DeleteAsync(T entity)
        {
            var objectId = (ObjectId)typeof(T).GetProperty("Id").GetValue(entity);
            if (objectId == ObjectId.Empty)
                throw new Exception("The object id cannot be empty.");

            await _mongoCollection.DeleteOneAsync(new BsonDocument("_id", objectId));
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
                //Free other managed objects that implement IDisposable only
            }

            _mongoClient = null;
            _mongoDatabase = null;
            _mongoCollection = null;

            _disposed = true;
        }
        #endregion
    }
}
