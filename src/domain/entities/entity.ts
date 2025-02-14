import {Id, TId} from '../../core';
import {IEntity} from './entity.interface';

export abstract class Entity<T> implements IEntity<T> {
  public readonly id: TId<T>;

  constructor(id?: Id<T>) {
    this.id = id ? id : new Id();
  }

  private isEntity(v: unknown): v is Entity<T> {
    return v instanceof Entity;
  }

  public equal(object?: Entity<T>): boolean {
    if (object === null || object === undefined) {
      return false;
    }

    if (this === object) {
      return true;
    }

    if (!this.isEntity(object)) {
      return false;
    }

    return this.id.equal(object.id);
  }
}
