import { Id } from "../../core/types/core";
import { Nullable } from "../../core/types/core";

// TODO: update this function
export const toNullableId = (number: unknown): Nullable<Id> => {
  if (parseInt(number as string) >= 0) return parseInt(number as string);
  return null;
};

export const isOfEnum = <T>(value: unknown, allEnumValues: T[]): value is T => {
  return allEnumValues.includes(value as T);
};

export const isOfEnumArray = <T>(values: unknown[], allEnumValues: T[]): values is T[] => {
  for (const value of values) {
    if (!allEnumValues.includes(value as T)) return false;
  }

  return true;
};
