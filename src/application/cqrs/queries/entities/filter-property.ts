import {FilterOperator} from './filter-operator';

export class FilterProperty {
  /// <summary> The data item field to which the filter operator is applied. </summary>
  public field: string;

  /// <summary> The value to which the field is compared. Has to be of the same type as the field. </summary>
  public value: string;

  /// <summary> The filter operator (comparison). </summary>
  public operator?: FilterOperator;

  /// <summary> Determines if the string comparison is case-insensitive. </summary>
  public ignoreCase: boolean;

  /// <summary> . </summary>
  constructor(
    field: string,
    value: string,
    operator?: FilterOperator,
    ignoreCase: boolean = true,
  ) {
    this.field = field;
    this.value = value;
    this.operator = operator;
    this.ignoreCase = ignoreCase;
  }
}
