using MongoDB.Bson;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;

namespace Caladan.Repositories
{
    /// <summary>
    /// MongoDB repository interface.
    /// </summary>
    /// <typeparam name="T"></typeparam>
    interface IMongoRepository<T> where T : class

    {
        Task<IEnumerable<T>> GetAllAsync();

        Task<T> GetAsync(ObjectId id);

        Task<T> GetAsync(BsonDocument filter);

        Task<T> GetAsync(Expression<Func<T, bool>> filter);

        Task<T> GetAsync<R>(Expression<Func<T, bool>> filter, Expression<Func<T, R>> orderby);

        Task<T> GetAsync<R>(Expression<Func<T, bool>> filter, Expression<Func<T, R>> orderby, bool orderDescending);

        Task<IEnumerable<T>> FindAsync(FilterDefinition<T> filter, SortDefinition<T> orderby, int? take = null, int? skip = null);

        IQueryable<T> GetQueryable(Expression<Func<T, bool>> filter);

        IQueryable<T> GetQueryable<R>(Expression<Func<T, bool>> filter, Expression<Func<T, R>> orderby, bool orderDescending);

        Task<T> SaveAsync(T entity);

        Task<IEnumerable<T>> InsertMultipleAsync(IEnumerable<T> entities);

        void DeleteAsync(T entity);
    }
}
