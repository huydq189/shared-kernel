import {cloneDeep} from 'es-toolkit';
import {IClassValidatorService, Id} from '../../../application';
import {
  IAggregateRoot,
  isEntityAuditable,
  isEntityAuditableLogicalRemove,
  isValidatableObject,
  Result,
} from '../../../domain';
import {IEntityAuditableService} from '../services';
import {Crud} from './crud';
import {IDbContext} from './db-context.interface';
import {IOperation} from './operation.interface';

export abstract class DbContext implements IDbContext {
  public readonly id: Id;
  protected readonly auditableService: IEntityAuditableService;
  protected readonly classValidatorService: IClassValidatorService;
  protected readonly operations: IOperation[];
  protected readonly operationsExecuted: IOperation[];

  protected constructor(
    auditableService: IEntityAuditableService,
    classValidatorService: IClassValidatorService,
  ) {
    this.id = new Id();
    this.auditableService = auditableService;
    this.classValidatorService = classValidatorService;
    this.operations = [];
    this.operationsExecuted = [];
  }

  public add<TAggregateRoot extends IAggregateRoot<TId>, TId>(
    aggregateRoot: TAggregateRoot,
  ): void {
    this.operations.push({
      crud: Crud.Adding,
      aggregateRoot,
      commitMethod: () => this.addMethod(aggregateRoot),
      rollbackMethod: () => this.deleteMethod(aggregateRoot),
    });
  }

  public update<TAggregateRoot extends IAggregateRoot<TId>, TId>(
    aggregateRoot: TAggregateRoot,
  ): void {
    this.operations.push({
      crud: Crud.Updating,
      aggregateRoot,
      commitMethod: () => this.updateMethod(aggregateRoot),
      rollbackMethod: () => this.updateMethod(this.getById(aggregateRoot.id)!),
    });
  }

  public remove<TAggregateRoot extends IAggregateRoot<TId>, TId>(
    aggregateRoot: TAggregateRoot,
  ): void {
    this.operations.push(
      isEntityAuditableLogicalRemove(aggregateRoot)
        ? {
            crud: Crud.Deleting,
            aggregateRoot,
            commitMethod: () => this.updateMethod(aggregateRoot),
            rollbackMethod: () =>
              this.updateMethod(this.getById(aggregateRoot.id)!),
          }
        : {
            crud: Crud.Deleting,
            aggregateRoot,
            commitMethod: () => this.deleteMethod(aggregateRoot),
            rollbackMethod: () =>
              this.addMethod(this.getById(aggregateRoot.id)!),
          },
    );
  }

  public saveChanges(): number {
    this.validate();
    this.audit(this.operations);
    return this.commit();
  }

  public saveChangesResult(): Result<number> {
    const addingAndUpdating = this.operations.filter(
      x => x.crud === Crud.Adding || x.crud === Crud.Updating,
    );

    const x1 =
      this.classValidatorService.validateDataAnnotationsResult(
        addingAndUpdating,
      );

    const x2 = this.classValidatorService.validateValidatableObjectsResult(
      addingAndUpdating.filter(x => isValidatableObject(x)),
    );

    return Result.create()
      .combine(x1, x2)
      .tap(() => this.audit(this.operations))
      .tryBind(() => this.commit());
  }

  public rollback(): number {
    const total = this.operationsExecuted.length;

    for (const operation of this.operationsExecuted) {
      operation.rollbackMethod();
      this.operationsExecuted.splice(
        this.operationsExecuted.indexOf(operation),
        1,
      );
    }

    this.operations.length = 0;

    return total;
  }

  public rollbackResult(): Result<number> {
    return Result.ok(this.rollback());
  }

  protected abstract addMethod<TAggregateRoot extends IAggregateRoot<TId>, TId>(
    aggregateRoot: TAggregateRoot,
  ): void;

  protected abstract updateMethod<
    TAggregateRoot extends IAggregateRoot<TId>,
    TId,
  >(aggregateRoot: TAggregateRoot): void;

  protected abstract deleteMethod<
    TAggregateRoot extends IAggregateRoot<TId>,
    TId,
  >(aggregateRoot: TAggregateRoot): void;

  private commit(): number {
    const total = this.operations.length;

    this.beforeCommit();

    try {
      for (const operation of this.operations) {
        operation.commitMethod();
        this.operations.splice(this.operations.indexOf(operation), 1);
        this.operationsExecuted.push(operation);
      }
    } catch (error) {
      this.rollback();
    }

    this.afterCommit();

    return total;
  }

  protected beforeCommit(): void {}

  protected afterCommit(): void {}

  protected validate(): void {
    const addingAndUpdating = this.operations.filter(
      x => x.crud === Crud.Adding || x.crud === Crud.Updating,
    );

    this.classValidatorService.validateDataAnnotations(addingAndUpdating);

    this.classValidatorService.validateValidatableObjects(
      addingAndUpdating.filter(x => isValidatableObject(x)),
    );
  }

  protected audit(operations: IOperation[]): void {
    const operationsList = cloneDeep(operations);
    this.auditableService.audit(
      operationsList
        .filter(x => x.crud === Crud.Adding)
        .map(a => a.aggregateRoot)
        .filter(it => isEntityAuditable(it)),
      operationsList
        .filter(x => x.crud === Crud.Updating)
        .map(a => a.aggregateRoot)
        .filter(it => isEntityAuditable(it)),
      operationsList
        .filter(x => x.crud === Crud.Deleting)
        .map(a => a.aggregateRoot)
        .filter(it => isEntityAuditableLogicalRemove(it)),
    );
  }

  public abstract getById<TAggregateRoot extends IAggregateRoot, TId>(
    id: TId,
  ): TAggregateRoot | null;
}
