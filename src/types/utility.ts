export type OptionalNullableFields<T> = {
  [Property in keyof T]?: T[Property] | null;
};
