import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'shortenId',
})
export class ShortenIdPipe implements PipeTransform {
  transform(value: string, length: number = 8): string {
    if (!value) return '';
    if (value.length <= length) return value;
    return `${value.substring(0, 4)}...${value.substring(value.length - 4)}`;
  }
}