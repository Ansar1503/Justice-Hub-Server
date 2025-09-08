import { IHttpResponse } from "@interfaces/helpers/IHttpResponse";
import { HttpRequest } from "@interfaces/helpers/implementation/HttpRequest";
import { IController } from "../Interface/IController";
import { IAddCasetypeUsecase } from "@src/application/usecases/CaseType/IAddCasetypeUsecase";
import { IHttpErrors } from "@interfaces/helpers/IHttpErrors.";
import { IHttpSuccess } from "@interfaces/helpers/IHttpSuccess";

export class AddCasetypeController implements IController {
  constructor(
    private AddCasetype: IAddCasetypeUsecase,
    private httpErrors: IHttpErrors,
    private httpSuccess: IHttpSuccess
  ) {}
  async handle(httpRequest: HttpRequest): Promise<IHttpResponse> {
    let name = "";
    let practiceid = "";
    if (httpRequest.body && typeof httpRequest.body === "object") {
      if ("name" in httpRequest.body) {
        name = String(httpRequest.body.name);
      }
      if ("pid" in httpRequest.body) {
        practiceid = String(httpRequest.body.pid);
      }
    }
    if (!name) {
      return this.httpErrors.error_400("name field is required");
    }
    if (!practiceid) {
      return this.httpErrors.error_400("practice area Id is required");
    }
    try {
      const result = await this.AddCasetype.execute({
        name,
        practiceareaId: practiceid,
      });
      return this.httpSuccess.success_200(result);
    } catch (error) {
      if (error instanceof Error) {
        return this.httpErrors.error_400(error.message);
      }
      return this.httpErrors.error_500();
    }
  }
}
