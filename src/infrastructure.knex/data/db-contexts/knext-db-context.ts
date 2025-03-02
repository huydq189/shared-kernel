#r "nuget: Microsoft.EntityFrameworkCore, 7.0.0"

using System;
using System.Linq;
using System.Collections.Generic;
using System.Reflection;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using System.Data;

// Dummy interfaces and classes to support the script version.
// In your project these would come from SharedKernel and related packages.
public interface IJsonSerializer { }
public interface IAuditableService
{
    void Audit(DbContext context);
}
public interface IClassValidatorService
{
    void ValidateDataAnnotations(IEnumerable<object> entities);
    void ValidateValidatableObjects(IEnumerable<IValidatableObject> entities);
    Result<Unit> ValidateDataAnnotationsResult(IEnumerable<object> entities);
    Result<Unit> ValidateValidatableObjectsResult(IEnumerable<IValidatableObject> entities);
}
public interface IAggregateRoot<TId> { }
public interface IValidatableObject { }
public interface IDbContextAsync { }

public class Result<T>
{
    public static Result<T> Create(T value) => new Result<T>();
    public static Result<T> Failure(T value) => new Result<T>();
    public Result<T> Combine(params Result<Unit>[] results) => this;
    public Result<T> Tap(Action action) { action(); return this; }
    public Result<U> Map<U>(Func<T, U> func) => Result<U>.Create(func(default(T)!));
    public Result<U> TryBind<U>(Func<Unit, Task<U>> func, Func<DbUpdateException, Result<U>> errorSelector, Func<Exception, Result<U>> exceptionSelector)
        => Result<U>.Create(default(U)!);
}
public struct Unit
{
    public static readonly Unit Value = new Unit();
}
public class Error
{
    public static Error Create(string message) => new Error();
}
public class OriginalEntry
{
    public EntityEntry Entry { get; }
    public object OriginalValues { get; }
    public EntityState State { get; }
    public OriginalEntry(EntityEntry entry, object originalValues, EntityState state)
    {
        Entry = entry;
        OriginalValues = originalValues;
        State = state;
    }
}

// The EntityFrameworkDbContext class converted into a script.
public abstract class EntityFrameworkDbContext : DbContext, IDbContextAsync
{
    private readonly Assembly _assemblyConfigurations;
    private readonly IAuditableService? _auditableService;
    private readonly IClassValidatorService? _classValidatorService;
    private readonly List<OriginalEntry> _originalEntries;

    public EntityFrameworkDbContext(DbContextOptions options, string schema, Assembly assemblyConfigurations,
        IJsonSerializer? jsonSerializer = default, IClassValidatorService? classValidatorService = default,
        IAuditableService? auditableService = default) : base(options)
    {
        Id = Guid.NewGuid();
        _assemblyConfigurations = assemblyConfigurations;
        _classValidatorService = classValidatorService;
        _auditableService = auditableService;
        Schema = schema;
        JsonSerializer = jsonSerializer;
        ChangeTracker.LazyLoadingEnabled = false;
        _originalEntries = new List<OriginalEntry>();
    }

    public Guid Id { get; }
    public string Schema { get; }
    public IJsonSerializer? JsonSerializer { get; }
    public IDbConnection GetConnection => Database.GetDbConnection();

    public void Add<TAggregateRoot, TId>(TAggregateRoot aggregateRoot)
        where TAggregateRoot : class, IAggregateRoot<TId>
        where TId : notnull
    {
        base.Set<TAggregateRoot>().Add(aggregateRoot);
    }

    public void Update<TAggregateRoot, TId>(TAggregateRoot aggregateRoot)
        where TAggregateRoot : class, IAggregateRoot<TId>
        where TId : notnull
    {
        base.Set<TAggregateRoot>().Update(aggregateRoot);
    }

    public void Remove<TAggregateRoot, TId>(TAggregateRoot aggregateRoot)
        where TAggregateRoot : class, IAggregateRoot<TId>
        where TId : notnull
    {
        base.Set<TAggregateRoot>().Remove(aggregateRoot);
    }

    public TAggregateRoot GetById<TAggregateRoot, TId>(TId id)
        where TAggregateRoot : class, IAggregateRoot<TId>
        where TId : notnull
    {
        throw new NotImplementedException();
    }

    public override int SaveChanges()
    {
        try
        {
            _originalEntries.AddRange(ChangeTracker.Entries()
                .Select(e => new OriginalEntry(e, e.OriginalValues.Clone(), e.State)));

            _classValidatorService?.ValidateDataAnnotations(
                ChangeTracker.Entries().Where(e => e.State != EntityState.Deleted).Select(e => e.Entity).ToList());

            _classValidatorService?.ValidateValidatableObjects(
                ChangeTracker.Entries().Where(e => e.State != EntityState.Deleted).Select(e => e.Entity)
                .OfType<IValidatableObject>().ToList());
            _auditableService?.Audit(this);
            return base.SaveChanges();
        }
#if !NET462 && !NET47 && !NET471
        catch (DbUpdateException exUpdate)
        {
            throw new Exception(string.Join(", ", exUpdate.Entries.Select(e => e.ToString())), exUpdate);
        }
#else
        catch (Exception)
        {
            throw;
        }
#endif
    }

    public virtual Result<int> SaveChangesResult()
    {
#if !NET462 && !NET47 && !NET471
        try
        {
#endif
        return Result
            .Create(Unit.Value)
#if NET47_OR_GREATER || NET6_0_OR_GREATER || NETSTANDARD
            .Combine(
                _classValidatorService?.ValidateDataAnnotationsResult(
                    ChangeTracker.Entries().Where(e => e.State != EntityState.Deleted)
                    .Select(e => e.Entity).ToList()) ??
                Result.Create(Unit.Value),
                _classValidatorService?.ValidateValidatableObjectsResult(
                    ChangeTracker.Entries().Where(e => e.State != EntityState.Deleted)
                    .Select(e => e.Entity).OfType<IValidatableObject>().ToList()) ??
                Result.Create(Unit.Value))
#endif
            .Tap(_ => _auditableService?.Audit(this))
            .Map(_ => base.SaveChanges());
#if !NET462 && !NET47 && !NET471
        }
        catch (DbUpdateException exUpdate)
        {
            return Result.Failure<int>(exUpdate.Entries.Select(e => Error.Create(e.ToString())));
        }
#endif
    }

    public virtual Task<int> SaveChangesAsync() => SaveChangesAsync(CancellationToken.None);

    public new virtual async Task<int> SaveChangesAsync(CancellationToken cancellationToken)
    {
#if !NET462 && !NET47 && !NET471
        try
        {
#endif
        _originalEntries.AddRange(ChangeTracker.Entries()
            .Select(e => new OriginalEntry(e, e.OriginalValues.Clone(), e.State)));

        _classValidatorService?.ValidateDataAnnotations(
            ChangeTracker.Entries().Where(e => e.State != EntityState.Deleted)
            .Select(e => e.Entity).ToList());

        _classValidatorService?.ValidateValidatableObjects(
            ChangeTracker.Entries().Where(e => e.State != EntityState.Deleted)
            .Select(e => e.Entity).OfType<IValidatableObject>().ToList());

        _auditableService?.Audit(this);
        return await base.SaveChangesAsync(cancellationToken);
#if !NET462 && !NET47 && !NET471
        }
        catch (DbUpdateException dbUpdateException)
        {
            throw new Exception(string.Join(", ", dbUpdateException.Entries.Select(e => e.ToString())), dbUpdateException);
        }
#endif
    }

    public Task<Result<int>> SaveChangesResultAsync(CancellationToken cancellationToken) =>
        Result.Create(Unit.Value)
            .Combine(
                _classValidatorService?.ValidateDataAnnotationsResult(
                    ChangeTracker.Entries().Where(e => e.State != EntityState.Deleted)
                    .Select(e => e.Entity).ToList()) ??
                Result.Create(Unit.Value),
                _classValidatorService?.ValidateValidatableObjectsResult(
                    ChangeTracker.Entries().Where(e => e.State != EntityState.Deleted)
                    .Select(e => e.Entity).OfType<IValidatableObject>().ToList()) ??
                Result.Create(Unit.Value))
            .Tap(_ => _auditableService?.Audit(this))
            .Map(_ => Unit.Value)
            .TryBind<Unit, int, DbUpdateException>(_ => base.SaveChangesAsync(cancellationToken),
                dbUpdateException => Result.Failure<int>(
                    new List<Error> { Error.Create(dbUpdateException.InnerException?.ToString() ?? dbUpdateException.Message) }
                    .Concat(dbUpdateException.Entries.Select(e => Error.Create(e.ToString())))),
                exception => Result.Failure<int>(Error.Create(exception.InnerException?.ToString() ?? exception.Message)));

    public virtual int Rollback()
    {
        foreach (var entryInfo in _originalEntries)
        {
            var entry = entryInfo.Entry;
            switch (entryInfo.State)
            {
                case EntityState.Detached:
                    break;
                case EntityState.Unchanged:
                    break;
                case EntityState.Deleted:
                    entry.State = EntityState.Added;
                    break;
                case EntityState.Modified:
                    entry.CurrentValues.SetValues(entryInfo.OriginalValues);
                    entry.State = EntityState.Modified;
                    break;
                case EntityState.Added:
                    entry.State = EntityState.Deleted;
                    break;
                default:
                    throw new ArgumentOutOfRangeException();
            }
        }
        _originalEntries.Clear();
        return SaveChanges();
    }

    public virtual int RejectChanges()
    {
        var changedEntries = ChangeTracker.Entries().Where(x => x.State != EntityState.Unchanged).ToList();
        foreach (var entry in changedEntries)
        {
            switch (entry.State)
            {
                case EntityState.Modified:
                    entry.CurrentValues.SetValues(entry.OriginalValues);
                    entry.State = EntityState.Unchanged;
                    break;
                case EntityState.Added:
                    entry.State = EntityState.Detached;
                    break;
                case EntityState.Deleted:
                    entry.State = EntityState.Unchanged;
                    break;
            }
        }
        return changedEntries.Count;
    }

    public virtual Result<int> RollbackResult() => Result<int>.Create(Rollback());

    public virtual Task<int> RollbackAsync(CancellationToken cancellationToken)
    {
        foreach (var entryInfo in _originalEntries)
        {
            var entry = entryInfo.Entry;
            switch (entryInfo.State)
            {
                case EntityState.Detached:
                    break;
                case EntityState.Unchanged:
                    break;
                case EntityState.Deleted:
                    entry.State = EntityState.Added;
                    break;
                case EntityState.Modified:
                    entry.CurrentValues.SetValues(entryInfo.OriginalValues);
                    entry.State = EntityState.Modified;
                    break;
                case EntityState.Added:
                    entry.State = EntityState.Deleted;
                    break;
                default:
                    throw new ArgumentOutOfRangeException();
            }
        }
        _originalEntries.Clear();
        return SaveChangesAsync(cancellationToken);
    }

    public virtual Task<Result<int>> RollbackResultAsync(CancellationToken cancellationToken)
        => Task.FromResult(RollbackResult());

    public IQueryable<object> Set(Type type)
    {
        var method = GetType().GetMethod("Set", Type.EmptyTypes)!
            .MakeGenericMethod(type);
        return (IQueryable<object>)method.Invoke(this, null)!;
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.HasDefaultSchema(Schema);
        foreach (var relationship in modelBuilder.Model.GetEntityTypes().SelectMany(e => e.GetForeignKeys()))
            relationship.DeleteBehavior = DeleteBehavior.Restrict;
        modelBuilder.ApplyConfigurationsFromAssembly(_assemblyConfigurations);
    }

    public Task AddAsync<TAggregateRoot, TId>(TAggregateRoot aggregateRoot, CancellationToken cancellationToken)
        where TAggregateRoot : class, IAggregateRoot<TId>
        where TId : notnull
        => base.Set<TAggregateRoot>().AddAsync(aggregateRoot, cancellationToken).AsTask();

    public Task UpdateAsync<TAggregateRoot, TId>(TAggregateRoot aggregateRoot, CancellationToken cancellationToken)
        where TAggregateRoot : class, IAggregateRoot<TId>
        where TId : notnull
    {
        base.Set<TAggregateRoot>().Update(aggregateRoot);
        return Task.CompletedTask;
    }

    public Task RemoveAsync<TAggregateRoot, TId>(TAggregateRoot aggregateRoot, CancellationToken cancellationToken)
        where TAggregateRoot : class, IAggregateRoot<TId>
        where TId : notnull
    {
        base.Set<TAggregateRoot>().Remove(aggregateRoot);
        return Task.CompletedTask;
    }

    public Task<TAggregateRoot?> GetByIdAsync<TAggregateRoot, TId>(TId id, CancellationToken cancellationToken)
        where TAggregateRoot : class, IAggregateRoot<TId>
        where TId : notnull
    {
        throw new NotImplementedException();
    }
}

// Optional: a dummy concrete implementation so you can instantiate and test the context.
public class MyDbContext : EntityFrameworkDbContext
{
    public MyDbContext(DbContextOptions options, string schema, Assembly assemblyConfigurations)
        : base(options, schema, assemblyConfigurations)
    {
    }

    public override TAggregateRoot GetById<TAggregateRoot, TId>(TId id)
    {
        // Dummy implementation.
        throw new NotImplementedException();
    }

    public override Task<TAggregateRoot?> GetByIdAsync<TAggregateRoot, TId>(TId id, CancellationToken cancellationToken)
    {
        // Dummy implementation.
        throw new NotImplementedException();
    }
}

