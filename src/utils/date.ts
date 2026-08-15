import { formatDistanceToNow, isValid, parseISO } from 'date-fns';

export const formatRelativeDate = (value?: string | null): string | null => {
  if (!value) {
    return null;
  }

  const date = parseISO(value);

  if (!isValid(date)) {
    return null;
  }

  return formatDistanceToNow(date, { addSuffix: true });
};
