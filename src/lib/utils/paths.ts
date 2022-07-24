import path from "path";

export const buildPathFromRoot = (...paths: string[]): string => {
  return path.join(process.cwd(), ...paths);
};
