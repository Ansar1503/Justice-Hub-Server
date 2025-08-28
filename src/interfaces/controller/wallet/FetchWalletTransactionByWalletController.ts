import { IHttpResponse } from "@interfaces/helpers/IHttpResponse";
import { HttpRequest } from "@interfaces/helpers/implementation/HttpRequest";
import { IController } from "../Interface/IController";
import { IFetchWalletTransactionsByWallet } from "@src/application/usecases/Wallet/IFetchWalletTransactionsByWallet";
import { IHttpErrors } from "@interfaces/helpers/IHttpErrors.";
import { HttpErrors } from "@interfaces/helpers/implementation/HttpErrors";
import { IHttpSuccess } from "@interfaces/helpers/IHttpSuccess";
import { HttpSuccess } from "@interfaces/helpers/implementation/HttpSuccess";

export class FetchWalletTransactionByWalletController implements IController {
  constructor(
    private fetchTransactionByWallet: IFetchWalletTransactionsByWallet,
    private httpErrors: IHttpErrors = new HttpErrors(),
    private httpSuccess: IHttpSuccess = new HttpSuccess()
  ) {}
  async handle(httpRequest: HttpRequest): Promise<IHttpResponse> {
    let userId = "";
    let page = 0;
    if (
      httpRequest.user &&
      typeof httpRequest.user === "object" &&
      "id" in httpRequest.user &&
      typeof httpRequest.user.id === "string"
    ) {
      userId = httpRequest.user.id;
    }
    if (!userId) {
      return this.httpErrors.error_400("user id not found");
    }
    if (
      httpRequest.query &&
      typeof httpRequest.query === "object" &&
      "page" in httpRequest.query
    ) {
      if (isNaN(Number(httpRequest.query.page))) {
        page = 1;
      } else {
        page = Number(httpRequest.query.page);
      }
    }
    if (!page) {
      page = 1;
    }
    try {
      const result = await this.fetchTransactionByWallet.execute({
        userId,
        page,
      });
      return this.httpSuccess.success_200(result);
    } catch (error) {
      if (error instanceof Error) {
        return this.httpErrors.error_400(error.message);
      }
      return this.httpErrors.error_500("internal server error");
    }
  }
}
