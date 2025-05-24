import { Pipe, PipeTransform } from '@angular/core';

enum Seconds  {
  Minute = 60,
  Hour = 3600,
  Day = 86400
}

@Pipe({
    name: 'dateAgo',
    standalone: true
})
export class DateAgoPipe implements PipeTransform {

  transform(value: string, ...args: unknown[]): string {
    const createdAtToLocal = (new Date(value)).toString();
    const seconds = (+new Date() - Date.parse(createdAtToLocal)) / 1000;
    if(seconds > Seconds.Day){
      const date = new Date(Date.parse(value));
      const formatter = new Intl.DateTimeFormat('ru', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      return formatter.format(date);
    }
    if (seconds < Seconds.Day && seconds >= Seconds.Hour ) {
      return  `${Math.floor(seconds / Seconds.Hour)} ч.`;
    }
    if (seconds < Seconds.Hour && seconds >= Seconds.Minute){
      return `${Math.floor(seconds / Seconds.Minute)} мин.`;
    }
    if (seconds <= Seconds.Minute){
      return 'Только что';
    }
  }

}
