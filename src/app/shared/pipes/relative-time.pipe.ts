import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'relativeTime',
})
export class RelativeTimePipe implements PipeTransform {
  transform(value: string | Date | number | null | undefined): string {
    if (value === null || value === undefined || value === '') {
      return '';
    }

    const timestamp = value instanceof Date ? value.getTime() : new Date(value).getTime();
    if (Number.isNaN(timestamp)) {
      return '';
    }

    const elapsedMinutes = Math.floor(Math.max(0, Date.now() - timestamp) / 60_000);
    if (elapsedMinutes === 0) {
      return 'just now';
    }
    if (elapsedMinutes < 60) {
      return `${elapsedMinutes} minute${elapsedMinutes === 1 ? '' : 's'} ago`;
    }

    const elapsedHours = Math.floor(elapsedMinutes / 60);
    if (elapsedHours < 24) {
      return `${elapsedHours} hour${elapsedHours === 1 ? '' : 's'} ago`;
    }

    const elapsedDays = Math.floor(elapsedHours / 24);
    if (elapsedDays < 365) {
      return `${elapsedDays} day${elapsedDays === 1 ? '' : 's'} ago`;
    }

    const elapsedYears = Math.floor(elapsedDays / 365);
    return `${elapsedYears} year${elapsedYears === 1 ? '' : 's'} ago`;
  }
}
