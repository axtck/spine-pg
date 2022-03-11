import { Environment } from "./../types";
import { LogMessageTypes } from "./types";
import { penv } from "../config/penv";
import { Constants } from "../Constants";
import { injectable } from "tsyringe";
import winston from "winston";
import path from "path";

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
        winston.format.printf(({ timestamp, level, message }) => {
            return `${timestamp} ${level}: ${message}`;
        })
    );

    private readonly transports = [
        new winston.transports.Console(),
        new winston.transports.File({
            filename: path.join(".", "log", "error.log"),
            level: "error"
        }),
        new winston.transports.File({ filename: path.join(".", "log", "all.log") })
    ];

    private readonly logger: winston.Logger = winston.createLogger({
        level: this.level,
        levels: this.levels,
        format: this.format,
        transports: this.transports
    });

    public error = (message: LogMessageTypes): void => {
        this.logger.error(message);
    };

    public warn = (message: LogMessageTypes): void => {
        this.logger.warn(message);
    };

    public info = (message: LogMessageTypes): void => {
        this.logger.info(message);
    };

    public http = (message: LogMessageTypes): void => {
        this.logger.http(message);
    };

    public debug = (message: LogMessageTypes): void => {
        this.logger.debug(message);
    };
}
