import * as tinycolor from 'tinycolor2';

export default class Color {

  stringVal: string;
  numberVal: number;

  constructor(color: string | number) {
    let s: string = color as string;
    if (s.substring(0, 2) === '0x') s = s.substring(2);
    let t = tinycolor(s as string);
    this.stringVal = t.toString();
    this.numberVal = parseInt('0x' + t.toHex());
  }

  toString(): string {
    return this.stringVal;
  }

  toNumber(): number {
    return this.numberVal;
  }

  darken(amount: number): Color {
    return new Color(tinycolor(this.stringVal).darken(amount).toString());
  }

}