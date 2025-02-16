// import {cloneDeep} from 'es-toolkit';
// import {IClassValidatorService} from '../../../application';
// import {Id, ResultT} from '../../../core';
// import {
//   IAggregateRoot,
//   isEntityAuditable,
//   isEntityAuditableLogicalRemove,
//   isValidatableObject,
// } from '../../../domain';
// import {IEntityAuditableService} from '../services';
// import {Crud} from './crud';
// import {IDbContext} from './db-context.interface';
// import {IOperation} from './operation.interface';

// export abstract class DbContext implements IDbContext {
//   public readonly id: Id;
//   protected readonly auditableService: IEntityAuditableService;
//   protected readonly classValidatorService: IClassValidatorService;
//   protected readonly operations: IOperation[];
//   protected readonly operationsExecuted: IOperation[];

//   protected constructor(
//     auditableService: IEntityAuditableService,
//     classValidatorService: IClassValidatorService,
//   ) {
//     this.id = new Id();
//     this.auditableService = auditableService;
//     this.classValidatorService = classValidatorService;
//     this.operations = [];
//     this.operationsExecuted = [];
//   }

//   private  commit(): number {
//       const total = this.operations.length;

//       this.beforeCommit();

//       try
//       {
//           foreach (var operation in Operations.ToList())
//           {
//               operation.CommitMethod();
//               Operations.Remove(operation);
//               OperationsExecuted.Add(operation);
//           }
//       }
//       catch (Exception)
//       {
//           Rollback();
//       }

//       this.afterCommit();

//       return total;
//   }

//   public rollback(): number {
//     const total = this.operationsExecuted.length;

//     for (const operation of this.operationsExecuted) {
//       operation.rollbackMethod();
//       this.operationsExecuted.splice(this.operationsExecuted.indexOf(operation), 1);
//     }

//     this.operations.length = 0;

//     return total;
//   }

//   public rollbackResult(): ResultT<number> {
//     return this.rollback();
//   }

//   protected abstract addMethod<TAggregateRoot extends IAggregateRoot<TId>, TId>(aggregateRoot: TAggregateRoot): void;

//   protected abstract updateMethod<TAggregateRoot extends IAggregateRoot<TId>, TId>(aggregateRoot: TAggregateRoot): void;

//   protected abstract deleteMethod<TAggregateRoot extends IAggregateRoot<TId>, TId>(aggregateRoot: TAggregateRoot): void;

//   protected beforeCommit(): void {}

//   protected afterCommit(): void {}

//   protected validate(): void {
//     const addingAndUpdating = this.operations.filter(
//       x => x.crud === Crud.Adding || x.crud === Crud.Updating,
//     );

//     this.classValidatorService.validateDataAnnotations(addingAndUpdating);

//     this.classValidatorService.validateValidatableObjects(
//       addingAndUpdating.filter(x => isValidatableObject(x)),
//     );
//   }

//   protected audit(operations: IOperation[]) {
//     const operationsList = cloneDeep(operations);
//     this.auditableService.audit(
//       operationsList
//         .filter(x => x.crud === Crud.Adding)
//         .map(a => a.aggregateRoot)
//         .filter(it => isEntityAuditable(it)),
//       operationsList
//         .filter(x => x.crud === Crud.Updating)
//         .map(a => a.aggregateRoot)
//         .filter(it => isEntityAuditable(it)),
//       operationsList
//         .filter(x => x.crud === Crud.Deleting)
//         .map(a => a.aggregateRoot)
//         .filter(it => isEntityAuditableLogicalRemove(it)),
//     );
//   }

//   public abstract getById<TAggregateRoot extends IAggregateRoot<TId>, TId>(
//     id: TId,
//   ): TAggregateRoot | null;
// }
