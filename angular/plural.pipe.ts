import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'plural'
})
export class PluralPipe implements PipeTransform {

  transform(value: number, ...declensions: string[]): string {
    const indexes = [2, 0, 1, 1, 1, 2];

    return declensions[(value % 100 > 4 && value % 100 < 20) ? 2 : indexes[(value % 10 < 5) ? value % 10 : 5]];
  }

}
