import '@angular/compiler';
import { describe, expect, it } from 'vitest';
import { CalendarDatePipe } from '../src/app/shared/pipes/calendar-date.pipe';

describe('calendar date presentation', () => {
  const pipe = new CalendarDatePipe();
  it('keeps the booked day intact instead of shifting local midnight to the previous UTC day', () => {
    expect(pipe.transform('2026-11-04')).toBe('04 Nov 2026');
    expect(pipe.transform('2026-11-04', 'EEE, dd MMM yyyy')).toBe('Wed, 04 Nov 2026');
    expect(pipe.transform('2032-02-29')).toBe('29 Feb 2032');
  });
  it('gives useful feedback for incomplete or impossible calendar dates', () => {
    expect(pipe.transform('')).toBe('Choose a date');
    expect(pipe.transform('2026-02-30')).toBe('Choose a date');
  });
});
