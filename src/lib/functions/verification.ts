import { Nullable } from "./../../types";

export const anyToPositiveNumber = (number: unknown): Nullable<number> => {
    if (parseInt(number as string) >= 0) return parseInt(number as string);
    return null;
};