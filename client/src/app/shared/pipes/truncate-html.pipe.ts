import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncateHtml',
  standalone: true
})
export class TruncateHtmlPipe implements PipeTransform {
  transform(value: string | null, limit: number = 100): string {
    if (!value) {
      return '';
    }

    // 1. Strip HTML tags
    const withoutHtml = value.replace(/<(?:.|\n)*?>/gm, '');

    // 2. Truncate the plain text
    if (withoutHtml.length <= limit) {
      return withoutHtml;
    }

    return withoutHtml.substring(0, limit) + '...';
  }
}
