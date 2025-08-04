import { IController } from "../Interface/IController";
import { HttpRequest } from "@interfaces/helpers/implementation/HttpRequest";
import { HttpResponse } from "@interfaces/helpers/implementation/HttpResponse";
import { IHttpResponse } from "@interfaces/helpers/IHttpResponse";
import { STATUS_CODES } from "@infrastructure/constant/status.codes";
import { ValidationError } from "@interfaces/middelwares/Error/CustomError";

export class SendMessageFileController implements IController {
  async handle(httpRequest: HttpRequest): Promise<IHttpResponse> {
    const { sessionId } = (httpRequest.body as { sessionId?: string }) || {};
    const file = (httpRequest as HttpRequest & { file?: any }).file;

    if (!sessionId) throw new ValidationError("sessionId is required");
    if (!file) throw new ValidationError("file is required! send a file");

    const [type, subtype] = file.mimetype.split("/");
    let fileType = "";

    if (type === "image") {
      fileType = "image";
    } else if (subtype === "pdf") {
      fileType = "pdf";
    } else if (
      subtype === "vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      fileType = "docx";
    } else {
      fileType = "unknown";
    }

    const document = {
      name: file.originalname,
      url: file.path,
      type: fileType,
    };

    return new HttpResponse(STATUS_CODES.ACCEPTED, document);
  }
}
