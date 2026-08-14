export const toError = (
  reason: unknown,
  fallbackMessage = 'Unknown error',
): Error =>
  reason instanceof Error ? reason : new Error(fallbackMessage);
