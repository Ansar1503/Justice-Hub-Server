"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SendMessageFileController = void 0;
const HttpResponse_1 = require("@interfaces/helpers/implementation/HttpResponse");
const status_codes_1 = require("@infrastructure/constant/status.codes");
const CustomError_1 = require("@interfaces/middelwares/Error/CustomError");
class SendMessageFileController {
    async handle(httpRequest) {
        try {
            const { sessionId } = httpRequest.body || {};
            const file = httpRequest.file;
            if (!sessionId)
                throw new CustomError_1.ValidationError("sessionId is required");
            if (!file)
                throw new CustomError_1.ValidationError("file is required! send a file");
            const [type, subtype] = file.mimetype.split("/");
            let fileType = "";
            if (type === "image") {
                fileType = "image";
            }
            else if (subtype === "pdf") {
                fileType = "pdf";
            }
            else if (subtype === "vnd.openxmlformats-officedocument.wordprocessingml.document") {
                fileType = "docx";
            }
            else {
                fileType = "unknown";
            }
            const document = {
                name: file.originalname,
                url: file.path,
                type: fileType,
            };
            return new HttpResponse_1.HttpResponse(status_codes_1.STATUS_CODES.ACCEPTED, document);
        }
        catch (error) {
            if (error instanceof Error) {
                return new HttpResponse_1.HttpResponse(status_codes_1.STATUS_CODES.BAD_REQUEST, error.message);
            }
            return new HttpResponse_1.HttpResponse(status_codes_1.STATUS_CODES.BAD_REQUEST, error);
        }
    }
}
exports.SendMessageFileController = SendMessageFileController;
