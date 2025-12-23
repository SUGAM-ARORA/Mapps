import { format, isToday, isTomorrow } from 'date-fns';

export function formatDateTime(value?: string) {
  if (!value) return '';
  const date = new Date(value);
  if (isToday(date)) return `Today · ${format(date, 'hh:mm a')}`;
  if (isTomorrow(date)) return `Tomorrow · ${format(date, 'hh:mm a')}`;
  return format(date, 'MMM dd · hh:mm a');
}
