import { IDeleteSpecializationUsecase } from "@src/application/usecases/Specializations/IDeleteSpecializationUseCase";
import { IController } from "../Interface/IController";
import { IHttpResponse } from "@interfaces/helpers/IHttpResponse";
import { HttpRequest } from "@interfaces/helpers/implementation/HttpRequest";
import { IHttpErrors } from "@interfaces/helpers/IHttpErrors.";
import { IHttpSuccess } from "@interfaces/helpers/IHttpSuccess";

export class DeleteSpecializationController implements IController {
  constructor(
    private deleteSpecialization: IDeleteSpecializationUsecase,
    private httpErrors: IHttpErrors,
    private httpSuccess: IHttpSuccess
  ) {}
  async handle(httpRequest: HttpRequest): Promise<IHttpResponse> {
    let id = "";
    if (
      httpRequest.params &&
      typeof httpRequest.params === "object" &&
      "id" in httpRequest.params
    ) {
      id = String(httpRequest.params.id);
    }
    if (!id) {
      return this.httpErrors.error_400("id not found");
    }
    try {
      const result = await this.deleteSpecialization.execute(id);
      return this.httpSuccess.success_200(result);
    } catch (error) {
      if (error instanceof Error) {
        return this.httpErrors.error_400(error.message);
      }
      return this.httpErrors.error_500();
    }
  }
}
