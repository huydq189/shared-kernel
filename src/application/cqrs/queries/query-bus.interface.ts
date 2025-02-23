/// <summary> Query bus abstraction. </summary>
export interface IQueryBus {
  /// <summary> Ask a query and return a data transfer object. </summary>
  ask<TResponse>(
    query: IQueryRequest<TResponse>,
    cancellationToken: CancellationToken,
  ): Promise<TResponse>;

  /// <summary> Ask a query and return a data transfer object. </summary>
  ask<TResponse>(
    query: IQueryRequest<Result<TResponse>>,
    cancellationToken: CancellationToken,
  ): Promise<Result<TResponse>>;
}
