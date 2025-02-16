import {ValidationContext} from './validation-context';
import {ValidationResult} from './validation-result';

export function isValidatableObject(obj: unknown): obj is IValidatableObject {
  return (
    !!obj &&
    typeof obj === 'object' &&
    'validate' in obj &&
    typeof obj.validate === 'function'
  );
}
export interface IValidatableObject {
  validate(validationContext: ValidationContext): ValidationResult[];
}
