import { RelativeTimePipe } from './relative-time.pipe';

describe('RelativeTimePipe', () => {
  const pipe = new RelativeTimePipe();
  const now = new Date('2026-11-05T12:00:00Z');

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(now);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('shows just now for dates less than a minute ago', () => {
    expect(pipe.transform(new Date(now.getTime() - 30_000))).toBe('just now');
  });

  it('formats minute, hour, day, and year counts', () => {
    expect(pipe.transform(new Date(now.getTime() - 5 * 60_000))).toBe('5 minutes ago');
    expect(pipe.transform(new Date(now.getTime() - 2 * 60 * 60_000))).toBe('2 hours ago');
    expect(pipe.transform(new Date(now.getTime() - 3 * 24 * 60 * 60_000))).toBe('3 days ago');
    expect(pipe.transform(new Date(now.getTime() - 2 * 365 * 24 * 60 * 60_000))).toBe('2 years ago');
  });

  it('returns an empty string for invalid or missing dates', () => {
    expect(pipe.transform('not a date')).toBe('');
    expect(pipe.transform(null)).toBe('');
  });
});
