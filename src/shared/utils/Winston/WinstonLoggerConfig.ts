import winston from "winston";
const { combine, timestamp, errors, prettyPrint } = winston.format;

export const WLogger = winston.createLogger({
  level: "info",
  format: combine(timestamp(), errors({ stack: true }), prettyPrint()),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "errors.log", level: "error" }),
    // new winston.transports.File({ filename: "combined.logs" }),
  ],
  exceptionHandlers: [
    new winston.transports.File({ filename: "unhandledexceptions.log" }),
  ],
  rejectionHandlers: [
    new winston.transports.File({ filename: "unhandledrejections.log" }),
  ],
});
