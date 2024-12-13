export interface IRepository<T> {
  getByIdAsync(id: number): Promise<T | null>
  listAsync(): Promise<ReadonlyArray<T>>
}
