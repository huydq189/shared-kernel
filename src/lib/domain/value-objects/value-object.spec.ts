import {ValueObject, ValueObjectProps, ValueObjectUtils} from '..';

describe('value-object', () => {
  describe('compare', () => {
    test('should to be equal another instance', () => {
      class Exam extends ValueObject<string> {
        constructor(props: ValueObjectProps<string>) {
          super(props);
        }
      }
      const a = new Exam({value: 'hello there'});
      const b = new Exam({value: 'hello there'});
      expect(a.compareTo(b)).toBeTruthy();
    });

    test('should not to be equal another instance', () => {
      class Exam extends ValueObject<string> {
        constructor(props: ValueObjectProps<string>) {
          super(props);
        }
      }
      const a = new Exam({value: 'hello there 1'});
      const b = new Exam({value: 'hello there 2'});

      expect(a.compareTo(b)).toBeFalsy();
      expect(ValueObjectUtils.compareBetween(a, b)).toBeFalsy();
    });

    describe('compare props as object', () => {
      interface Props {
        value: string;
        name: string;
      }
      class Simple extends ValueObject<Props> {
        constructor(props: Props) {
          super(props);
        }
      }

      it('should infer type on compare', () => {
        const a = new Simple({value: 'a', name: 'test'});
        const b = new Simple({value: 'b', name: 'test'});
        const c = new Simple({value: 'a', name: 'test'});

        expect(a.compareTo(b)).toBeFalsy();
        expect(a.compareTo(c)).toBeTruthy();
      });

      it('should compare nullable or undefined', () => {
        const a = new Simple({value: 'a', name: 'test'});
        const b = new Simple({value: 'b', name: 'test'});

        expect(a.compareTo(null)).toBeFalsy();
        expect(b.compareTo(undefined)).toBeFalsy();
      });

      it('should create a valid props object as value object', () => {
        const primitive = new Simple({value: 'TEST', name: 'test'});
        expect(typeof primitive.value()).toBe('object');
      });
    });

    describe('primitive value object as string', () => {
      class Primitive extends ValueObject<string> {
        constructor(props: ValueObjectProps<string>) {
          super(props);
        }
      }

      it('should create a valid primitive value object', () => {
        const primitive = new Primitive({value: 'TEST'});
        expect(typeof primitive.value()).toBe('string');
      });
    });

    describe('primitive value object as date', () => {
      class Primitive extends ValueObject<Date> {
        constructor(props: ValueObjectProps<Date>) {
          super(props);
        }
      }

      it('should create a valid primitive value object', () => {
        const date = new Date('2024-04-01T00:00:00');
        const primitive = new Primitive({value: date});
        expect(primitive.value()).toBeInstanceOf(Date);
        expect(primitive.value()).toBe(date);
      });
    });

    describe('primitive value object as array', () => {
      class Primitive extends ValueObject<Array<number>> {
        constructor(props: ValueObjectProps<Array<number>>) {
          super(props);
        }
      }

      it('should create a valid primitive value object', () => {
        const primitive = new Primitive({value: [1, 2, 3]});
        expect(primitive.value()).toEqual([1, 2, 3]);
      });
    });
    test('should return true when both value objects are null', () => {
      expect(ValueObjectUtils.compareBetween(null, null)).toBeTruthy();
    });

    test('should return true when both value objects are undefined', () => {
      expect(
        ValueObjectUtils.compareBetween(undefined, undefined),
      ).toBeTruthy();
    });

    test('should return false when one value object is null and the other is not', () => {
      class Exam extends ValueObject<string> {
        constructor(props: ValueObjectProps<string>) {
          super(props);
        }
      }
      const a = new Exam({value: 'hello there'});
      expect(ValueObjectUtils.compareBetween(a, null)).toBeFalsy();
      expect(ValueObjectUtils.compareBetween(null, a)).toBeFalsy();
    });

    test('should return false when one value object is undefined and the other is not', () => {
      class Exam extends ValueObject<string> {
        constructor(props: ValueObjectProps<string>) {
          super(props);
        }
      }
      const a = new Exam({value: 'hello there'});
      expect(ValueObjectUtils.compareBetween(a, undefined)).toBeFalsy();
      expect(ValueObjectUtils.compareBetween(undefined, a)).toBeFalsy();
    });

    test('should return false when value objects have different constructors', () => {
      class Exam1 extends ValueObject<string> {
        constructor(props: ValueObjectProps<string>) {
          super(props);
        }
      }
      class Exam2 extends ValueObject<string> {
        constructor(props: ValueObjectProps<string>) {
          super(props);
        }
      }
      const a = new Exam1({value: 'hello there'});
      const b = new Exam2({value: 'hello there'});
      expect(ValueObjectUtils.compareBetween(a, b)).toBeFalsy();
    });

    test('should return true when value objects have the same value', () => {
      class Exam extends ValueObject<string> {
        constructor(props: ValueObjectProps<string>) {
          super(props);
        }
      }
      const a = new Exam({value: 'hello there'});
      const b = new Exam({value: 'hello there'});
      expect(ValueObjectUtils.compareBetween(a, b)).toBeTruthy();
    });

    test('should return false when value objects have different values', () => {
      class Exam extends ValueObject<string> {
        constructor(props: ValueObjectProps<string>) {
          super(props);
        }
      }
      const a = new Exam({value: 'hello there 1'});
      const b = new Exam({value: 'hello there 2'});
      expect(ValueObjectUtils.compareBetween(a, b)).toBeFalsy();
    });

    test('should correctly identify domain primitive', () => {
      class Exam extends ValueObject<string> {
        constructor(props: ValueObjectProps<string>) {
          super(props);
        }
      }
      const a = new Exam({value: 'hello there'});
      expect(a.value()).toBeTruthy();
    });

    test('should extract value correctly for domain primitive', () => {
      class Exam extends ValueObject<string> {
        constructor(props: ValueObjectProps<string>) {
          super(props);
        }
      }
      const a = new Exam({value: 'hello there'});
      expect(a.value()).toBe('hello there');
    });

    test('should extract value correctly for non-domain primitive', () => {
      interface Props {
        value: string;
        name: string;
      }
      class Exam extends ValueObject<Props> {
        constructor(props: Props) {
          super(props);
        }
      }
      const a = new Exam({value: 'hello there', name: 'test'});
      expect(a.value()).toEqual({
        value: 'hello there',
        name: 'test',
      });
    });
  });
});
