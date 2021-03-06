import { ISqlLog } from "../../core/types/SqlLog";
export const transformKeyValueJSON = (jsonData: unknown): string => {
  // split
  const splitRegex = new RegExp(/,"/);
  const splitted = JSON.stringify(jsonData).split(splitRegex);

  // join and remove quotes
  const replaceRegex = new RegExp(/["]/, "g");
  const joined: string = splitted
    .map(row => {
      return row.replace(replaceRegex, "");
    })
    .join("\n");

  // remove brackets
  const result = joined.slice(1, joined.length - 1);
  return result;
};

export const validateParameters = (sql: string, parameters: Array<string | number>): boolean => {
  const count = (sql.match(/\?/g) || []).length; // count ? occurences
  const nOptions = parameters.length; // count options

  return count === nOptions;
};

export const createSqlLog = (sql: string, parameters?: unknown[]): ISqlLog => {
  const trimmed: string = sql.replace(/\n/g, "").replace(/\s+/g, " ").trim();

  const log: ISqlLog = {
    sql: trimmed,
    parameters: parameters || []
  };

  return log;
};

export const createCleanSqlLogString = (slqLog: ISqlLog): string => {
  return JSON.stringify(slqLog).replace(/\\/g, "");
};
