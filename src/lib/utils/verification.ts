import { Nullable } from "../../types";

export const anyToPositiveNumber = (number: unknown): Nullable<number> => {
    if (parseInt(number as string) >= 0) return parseInt(number as string);
    return null;
};

export const isOfEnum = <T>(value: unknown, allEnumValues: T[]): value is T => {
    if (!allEnumValues.includes(value as T)) return false;
    return true;
};

export const isOfEnumArray = <T>(values: unknown[], allEnumValues: T[]): values is T[] => {
    for (const value of values) {
        if (!allEnumValues.includes(value as T)) return false;
    }

    return true;
};