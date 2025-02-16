import {TId} from '../../core';

export function isEntityAuditable(obj: unknown): obj is IEntityAuditable {
  return (
    !!obj &&
    typeof obj === 'object' &&
    'createdBy' in obj &&
    'createdAt' in obj &&
    'create' in obj &&
    obj.createdAt instanceof Date &&
    typeof obj.create === 'function' &&
    'change' in obj &&
    typeof obj.change === 'function'
  );
}

export interface IEntityAuditable {
  createdBy: TId;
  createdAt: Date;
  lastModifiedBy?: TId;
  lastModifiedAt?: Date;
  create(createdAt: Date, createdBy: TId): void;
  change(lastModifiedAt: Date, lastModifiedBy: TId): void;
}
