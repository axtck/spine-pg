import { penv } from "../config/penv";
import { Constants } from "../Constants";
import { injectable } from "inversify";
import { buildPathFromRoot } from "../lib/utils/paths";
import winston from "winston";
import { Environment } from "./types/Environment";

@injectable()
export class Logger {
  private readonly levels = Constants.logLevels;
  private readonly colors = Constants.logColors;

  constructor() {
    winston.addColors(this.colors);
  }

  private get level(): string {
    // decide what to log in what environment (log all in dev, otherwise info, warn, error)
    return penv.app.environment === Environment.Development ? "debug" : "info";
  }

  private readonly format: winston.Logform.Format = winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.colorize({ level: true }),
    winston.format.printf(({ timestamp, level, message }) => `${timestamp} ${level}: ${message}`)
  );

  private readonly transports = [
    new winston.transports.Console(),
    new winston.transports.File({
      filename: buildPathFromRoot("logs", "error.log"),
      level: "error"
    }),
    new winston.transports.File({ filename: buildPathFromRoot("logs", "all.log") })
  ];

  private readonly logger: winston.Logger = winston.createLogger({
    level: this.level,
    levels: this.levels,
    format: this.format,
    transports: this.transports
  });

  public error = (message: unknown): void => {
    this.logger.error(message);
  };

  public warn = (message: unknown): void => {
    this.logger.warn(message);
  };

  public info = (message: unknown): void => {
    this.logger.info(message);
  };

  public http = (message: unknown): void => {
    this.logger.http(message);
  };

  public debug = (message: unknown): void => {
    this.logger.debug(message);
  };
}
