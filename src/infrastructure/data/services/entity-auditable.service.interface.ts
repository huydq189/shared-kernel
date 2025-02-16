import {IEntityAuditable, IEntityAuditableLogicalRemove} from '../../../domain';

export interface IEntityAuditableService {
  /**
   * Audit the added, modified, and deleted entities.
   * @param added - The added entities.
   * @param modified - The modified entities.
   * @param deleted - The deleted entities.
   */
  audit(
    added: IEntityAuditable[],
    modified: IEntityAuditable[],
    deleted: IEntityAuditableLogicalRemove[],
  ): void;
}
