"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WLogger = void 0;
const winston_1 = __importDefault(require("winston"));
const { combine, timestamp, errors, prettyPrint } = winston_1.default.format;
exports.WLogger = winston_1.default.createLogger({
    level: "info",
    format: combine(timestamp(), errors({ stack: true }), prettyPrint()),
    transports: [
        new winston_1.default.transports.Console(),
        new winston_1.default.transports.File({ filename: "errors.log", level: "error" }),
        // new winston.transports.File({ filename: "combined.logs" }),
    ],
    exceptionHandlers: [
        new winston_1.default.transports.File({ filename: "unhandledexceptions.log" }),
    ],
    rejectionHandlers: [
        new winston_1.default.transports.File({ filename: "unhandledrejections.log" }),
    ],
});
