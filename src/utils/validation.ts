export type UnknownObject = Record<string, unknown>;

export const parseObject = (
  value: unknown,
  property: string,
): UnknownObject => {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    throw new Error(`${property} must be an object`);
  }

  return value as UnknownObject;
};

export const parseOptionalString = (
  value: unknown,
  property: string,
): string | null | undefined => {
  if (value === undefined || value === null || typeof value === 'string') {
    return value;
  }

  throw new Error(`${property} must be a string, null or undefined`);
};

export const parseNullableString = (
  value: unknown,
  property: string,
): string | null => {
  if (value === null || typeof value === 'string') {
    return value;
  }

  throw new Error(`${property} must be a string or null`);
};

export const parseArray = <Item>(
  value: unknown,
  property: string,
  parseItem: (item: unknown, property: string) => Item,
): Item[] => {
  if (!Array.isArray(value)) {
    throw new Error(`${property} must be an array`);
  }

  return value.map((item, index) => parseItem(item, `${property}[${index}]`));
};

export const parseOptionalArray = <Item>(
  value: unknown,
  property: string,
  parseItem: (item: unknown, property: string) => Item,
): Item[] | null | undefined => {
  if (value === undefined || value === null) {
    return value;
  }

  return parseArray(value, property, parseItem);
};
