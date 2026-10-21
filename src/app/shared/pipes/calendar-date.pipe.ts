import { Pipe, PipeTransform } from '@angular/core';
import { formatDate } from '@angular/common';
import { dateNumber } from '../../core/booking-rules';

/** Booking dates are calendar days, never instants in the visitor's timezone. */
@Pipe({ name: 'calendarDate', standalone: true })
export class CalendarDatePipe implements PipeTransform {
  transform(value: string, pattern = 'dd MMM yyyy'): string {
    if (!Number.isFinite(dateNumber(value))) return 'Choose a date';
    return formatDate(`${value}T00:00:00Z`, pattern, 'en-US', 'UTC');
  }
}
