import {Result} from '../../core';
import {IValidatableObject} from '../../domain/validators';

export interface IClassValidatorService {
  validateDataAnnotations<T>(classes: T[]): void;

  validateDataAnnotationsResult<T>(classes: T[]): Result<T>;

  validateValidatableObjects<T extends IValidatableObject>(
    validatableObjects: T[],
  ): void;

  validateValidatableObjectsResult<T extends IValidatableObject>(
    validatableObjects: T[],
  ): Result<T>;
}
