export type Primitives =
  | null
  | undefined
  | string
  | number
  | boolean
  | symbol
  | bigint;

export type BuiltIn = Primitives | Date | Array<unknown> | void | RegExp;

export type DomainPrimitive<T extends BuiltIn> = {
  value: T;
};
export type ValueObjectProps<T> = T extends BuiltIn ? DomainPrimitive<T> : T;
