export class ComboDto<TId> {
  value: TId;

  text: string;

  constructor(value: TId, text: string) {
    this.value = value;
    this.text = text;
  }
}
