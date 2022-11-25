export const isObject = (value: unknown): value is Record<string, unknown> =>
  value !== null && typeof value === 'object';

export const isNullish = (value: unknown): value is null | undefined => value == null;
