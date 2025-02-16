import {TId} from '../../core';
import {
  IEntityAuditable,
  isEntityAuditable,
} from './entity-auditable.interface';

export function isEntityAuditableLogicalRemove(
  obj: unknown,
): obj is IEntityAuditableLogicalRemove {
  return (
    isEntityAuditable(obj) &&
    'delete' in obj &&
    typeof obj.delete === 'function' &&
    'restore' in obj &&
    typeof obj.restore === 'function'
  );
}

export interface IEntityAuditableLogicalRemove extends IEntityAuditable {
  /**
   * The ID of the user who deleted the entity.
   */
  deletedBy?: TId;

  /**
   * The date and time when the entity was deleted.
   */
  deletedAt?: Date;

  /**
   * Marks the entity as deleted.
   * @param deletedAt The date and time when the entity was deleted.
   * @param userId The ID of the user who deleted the entity.
   */
  delete(deletedAt: Date, userId: TId): void;

  /**
   * Restores the entity from a deleted state.
   */
  restore(): void;
}
