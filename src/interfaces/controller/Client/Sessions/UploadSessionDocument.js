"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadSessionDocumentsController = void 0;
const HttpErrors_1 = require("@interfaces/helpers/implementation/HttpErrors");
const HttpSuccess_1 = require("@interfaces/helpers/implementation/HttpSuccess");
const HttpResponse_1 = require("@interfaces/helpers/implementation/HttpResponse");
class UploadSessionDocumentsController {
    uploadSessionDocument;
    httpErrors;
    httpSuccess;
    constructor(uploadSessionDocument, httpErrors = new HttpErrors_1.HttpErrors(), httpSuccess = new HttpSuccess_1.HttpSuccess()) {
        this.uploadSessionDocument = uploadSessionDocument;
        this.httpErrors = httpErrors;
        this.httpSuccess = httpSuccess;
    }
    async handle(httpRequest) {
        const req = httpRequest;
        const files = req.files;
        const sessionId = req.body.session_id;
        if (!sessionId) {
            throw new HttpResponse_1.HttpResponse(400, { message: "session id is required" });
        }
        if (!files || !Array.isArray(files)) {
            return new HttpResponse_1.HttpResponse(400, { message: "files are required" });
        }
        const documents = [];
        files.forEach((file) => {
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
            documents.push({
                name: file.originalname,
                url: file.path,
                type: fileType,
            });
        });
        try {
            const result = await this.uploadSessionDocument.execute({
                sessionId,
                document: documents,
            });
            const success = this.httpSuccess.success_200(result);
            return new HttpResponse_1.HttpResponse(success.statusCode, success.body);
        }
        catch (error) {
            const err = this.httpErrors.error_500();
            return new HttpResponse_1.HttpResponse(err.statusCode, err.body);
        }
    }
}
exports.UploadSessionDocumentsController = UploadSessionDocumentsController;
