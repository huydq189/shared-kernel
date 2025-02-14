import {isEqual} from 'es-toolkit';
import {BuiltIn, DomainPrimitive, ValueObjectProps} from './types';
import {IValueObject} from './value-object.interface';

export class ValueObjectUtils {
  public static compareBetween(
    leftVo?: ValueObject<unknown> | null,
    rightVo?: ValueObject<unknown> | null,
  ): boolean {
    if (leftVo === null && rightVo === null) {
      return true;
    }

    if (leftVo === undefined && rightVo === undefined) {
      return true;
    }

    if (
      !leftVo ||
      !rightVo ||
      leftVo.constructor.name !== rightVo.constructor.name
    ) {
      return false;
    }

    return leftVo.compareTo(rightVo);
  }
}

export abstract class ValueObject<T> implements IValueObject<T> {
  protected props: Readonly<ValueObjectProps<T>>;

  constructor(props: ValueObjectProps<T>) {
    this.props = Object.freeze(props);
  }

  public compareTo(vo?: this | null): boolean {
    if (!vo || this.constructor.name !== vo.constructor.name) return false;
    return isEqual(this.value(), vo.value());
  }

  private isDomainPrimitive(obj: object): obj is DomainPrimitive<T & BuiltIn> {
    if (
      Object.prototype.hasOwnProperty.call(obj, 'value') &&
      Object.keys(obj).length === 1
    ) {
      return true;
    }
    return false;
  }

  /**
   * Extract the value object to reveal the raw value or object.
   * @returns The raw value or object.
   */
  public value() {
    if (this.isDomainPrimitive(this.props)) return this.props.value;

    return this.props;
  }
}
