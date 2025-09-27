import { IController } from "../../Interface/IController";
import { IHttpResponse } from "@interfaces/helpers/IHttpResponse";
import { HttpRequest } from "@interfaces/helpers/implementation/HttpRequest";
import { IHttpErrors } from "@interfaces/helpers/IHttpErrors.";
import { HttpErrors } from "@interfaces/helpers/implementation/HttpErrors";
import { IHttpSuccess } from "@interfaces/helpers/IHttpSuccess";
import { HttpSuccess } from "@interfaces/helpers/implementation/HttpSuccess";
import { HttpResponse } from "@interfaces/helpers/implementation/HttpResponse";
import { IUploadSessionDocumentUseCase } from "@src/application/usecases/Client/IUploadSessionDocumentUseCase";

export class UploadSessionDocumentsController implements IController {
    constructor(
    private uploadSessionDocument: IUploadSessionDocumentUseCase,
    private httpErrors: IHttpErrors = new HttpErrors(),
    private httpSuccess: IHttpSuccess = new HttpSuccess()
    ) {}
    async handle(httpRequest: HttpRequest): Promise<IHttpResponse> {
        const req = httpRequest as Record<string, any>;
        const files = req.files;
        const sessionId = req.body.session_id;

        if (!sessionId) {
            throw new HttpResponse(400, { message: "session id is required" });
        }
        if (!files || !Array.isArray(files)) {
            return new HttpResponse(400, { message: "files are required" });
        }
        const documents: any = [];

        files.forEach((file) => {
            const [type, subtype] = file.mimetype.split("/");
            let fileType = "";

            if (type === "image") {
                fileType = "image";
            } else if (subtype === "pdf") {
                fileType = "pdf";
            } else if (
                subtype ===
        "vnd.openxmlformats-officedocument.wordprocessingml.document"
            ) {
                fileType = "docx";
            } else {
                fileType = "unknown";
            }

            documents.push({
                name: file.originalname,
                url: file.path,
                type: fileType,
            });
        });
        try {
            console.log({ sessionId, documents });
            const result = await this.uploadSessionDocument.execute({
                sessionId,
                document: documents,
            });
            const success = this.httpSuccess.success_200(result);
            return new HttpResponse(success.statusCode, success.body);
        } catch (error) {
            console.log("error in upload session documents : ", error);
            const err = this.httpErrors.error_500();
            return new HttpResponse(err.statusCode, err.body);
        }
    }
}
