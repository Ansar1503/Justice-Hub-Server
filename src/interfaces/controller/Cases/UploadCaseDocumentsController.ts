import { IUploadCaseDocuments } from "@src/application/usecases/CaseDocuments/IUploadCaseDocuments";
import { IController } from "../Interface/IController";
import { IHttpErrors } from "@interfaces/helpers/IHttpErrors.";
import { IHttpSuccess } from "@interfaces/helpers/IHttpSuccess";
import { IHttpResponse } from "@interfaces/helpers/IHttpResponse";
import { HttpRequest } from "@interfaces/helpers/implementation/HttpRequest";

export class UploadCaseDocumentsController implements IController {
  constructor(
    private _CaseDocumentUpload: IUploadCaseDocuments,
    private _errors: IHttpErrors,
    private _success: IHttpSuccess
  ) {}
  async handle(httpRequest: HttpRequest): Promise<IHttpResponse> {
    let userId = "";
    let fileUrl = "";
    let fileType = "";
    let fileName = "";
    let fileSize = 0;
    let caseId = "";
    if (
      httpRequest.user &&
      typeof httpRequest.user === "object" &&
      "id" in httpRequest.user
    ) {
      userId = String(httpRequest.user.id);
    }
    if (!userId) {
      return this._errors.error_400("user id not found");
    }
    if (httpRequest.file && typeof httpRequest.file === "object") {
      if (
        "mimetype" in httpRequest.file &&
        typeof httpRequest.file.mimetype === "string"
      ) {
        if (httpRequest.file.mimetype.startsWith("image/")) {
          fileType = "image";
        } else if (httpRequest.file.mimetype === "application/pdf") {
          fileType = "pdf";
        } else {
          fileType = "unknown";
        }
      }
      if ("originalname" in httpRequest.file) {
        fileName = String(httpRequest.file.originalname);
      }
      if ("path" in httpRequest.file) {
        fileUrl = String(httpRequest.file.path);
      }
      if ("size" in httpRequest.file) {
        fileSize = Number(httpRequest.file.size);
      }
    }
    if (
      httpRequest.body &&
      typeof httpRequest.body === "object" &&
      "caseId" in httpRequest.body
    ) {
      caseId = String(httpRequest.body.caseId);
    }
    if (
      !fileName ||
      !fileType ||
      fileType === "unknown" ||
      !fileUrl ||
      !fileSize ||
      isNaN(fileSize)
    ) {
      return this._errors.error_400("Invalid file");
    }
    if (!caseId) {
      return this._errors.error_400("case Id not found");
    }
    const document: { name: string; type: string; url: string; size: number } =
      {
        name: fileName,
        type: fileType,
        url: fileUrl,
        size: fileSize,
      };

    try {
      const result = await this._CaseDocumentUpload.execute({
        caseId,
        document,
        uploadedBy: userId,
      });
      return this._success.success_200(result);
    } catch (error) {
      if (error instanceof Error) {
        return this._errors.error_400(error.message);
      }
      return this._errors.error_500();
    }
  }
}
