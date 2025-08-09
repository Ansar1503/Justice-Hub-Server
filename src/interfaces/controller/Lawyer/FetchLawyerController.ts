import { IHttpResponse } from "@interfaces/helpers/IHttpResponse";
import { HttpRequest } from "@interfaces/helpers/implementation/HttpRequest";
import { IController } from "../Interface/IController";
import { IHttpSuccess } from "@interfaces/helpers/IHttpSuccess";
import { IHttpErrors } from "@interfaces/helpers/IHttpErrors.";
import { HttpSuccess } from "@interfaces/helpers/implementation/HttpSuccess";
import { HttpErrors } from "@interfaces/helpers/implementation/HttpErrors";
import { IFetchLawyerDataUseCase } from "@src/application/usecases/Lawyer/IFetchLawyerDataUseCase";

export class FetchLawyerController implements IController {
  constructor(
    private FetchLawyer: IFetchLawyerDataUseCase,
    private httpSuccess: IHttpSuccess = new HttpSuccess(),
    private httpErrors: IHttpErrors = new HttpErrors()
  ) {}
  async handle(httpRequest: HttpRequest): Promise<IHttpResponse> {
    let user_id: string = "";
    if (
      httpRequest.user &&
      typeof httpRequest.user === "object" &&
      "id" in httpRequest.user
    ) {
      user_id = String(httpRequest.user.id);
    }
    if (!user_id) {
      return this.httpErrors.error_400("User_id Not found");
    }
    try {
      const lawyers = await this.FetchLawyer.execute(user_id);
      return this.httpSuccess.success_200(lawyers);
    } catch (error) {
      return this.httpErrors.error_500("lawyer fetch failed");
    }
  }
}
