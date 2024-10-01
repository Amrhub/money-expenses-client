export function formatDate(date: Date | number | string) {
  if (typeof date === 'string') {
    date = new Date(date);
  }

  return new Intl.DateTimeFormat().format(date);
}

export const CURRENCY = 'L.E';
