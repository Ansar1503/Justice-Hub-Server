import { IHttpErrors } from "@interfaces/helpers/IHttpErrors.";
import { IController } from "../Interface/IController";
import { HttpErrors } from "@interfaces/helpers/implementation/HttpErrors";
import { IHttpSuccess } from "@interfaces/helpers/IHttpSuccess";
import { HttpSuccess } from "@interfaces/helpers/implementation/HttpSuccess";
import { IHttpResponse } from "@interfaces/helpers/IHttpResponse";
import { HttpRequest } from "@interfaces/helpers/implementation/HttpRequest";
import { IFetchAllNotificationsUseCase } from "@src/application/usecases/Notification/IFetchAllNotificationsUseCase";

export class FetchAllNotificationsController implements IController {
  constructor(
    private fetchAllNotificationsUseCase: IFetchAllNotificationsUseCase,
    private httpErrors: IHttpErrors = new HttpErrors(),
    private httpSuccess: IHttpSuccess = new HttpSuccess()
  ) {}
  async handle(httpRequest: HttpRequest): Promise<IHttpResponse> {
    let user_id = "";
    let cursor: number = 0;
    if (
      httpRequest.user &&
      typeof httpRequest.user === "object" &&
      "id" in httpRequest.user &&
      typeof httpRequest.user.id === "string"
    ) {
      user_id = httpRequest.user.id;
    }
    if (
      httpRequest.query &&
      typeof httpRequest.query == "object" &&
      "cursor" in httpRequest.query &&
      typeof httpRequest.query.cursor == "number"
    ) {
      cursor = httpRequest.query.cursor;
      console.log("cursor is hter", cursor);
    }
    try {
      const result = await this.fetchAllNotificationsUseCase.execute({
        user_id: user_id,
        cursor,
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
