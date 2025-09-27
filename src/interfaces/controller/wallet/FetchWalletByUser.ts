import { IHttpResponse } from "@interfaces/helpers/IHttpResponse";
import { HttpRequest } from "@interfaces/helpers/implementation/HttpRequest";
import { IController } from "../Interface/IController";
import { IFetchWalletByUser } from "@src/application/usecases/Wallet/IFetchWalletByUser";
import { IHttpErrors } from "@interfaces/helpers/IHttpErrors.";
import { HttpErrors } from "@interfaces/helpers/implementation/HttpErrors";
import { IHttpSuccess } from "@interfaces/helpers/IHttpSuccess";
import { HttpSuccess } from "@interfaces/helpers/implementation/HttpSuccess";

export class FetchWalletByUserController implements IController {
    constructor(
    private fetchWallet: IFetchWalletByUser,
    private httpErrors: IHttpErrors = new HttpErrors(),
    private httpSuccess: IHttpSuccess = new HttpSuccess()
    ) {}
    async handle(httpRequest: HttpRequest): Promise<IHttpResponse> {
        let userId = "";
        if (
            httpRequest.user &&
      typeof httpRequest.user === "object" &&
      "id" in httpRequest.user &&
      typeof httpRequest.user.id === "string"
        ) {
            userId = httpRequest.user.id;
        }
        if (!userId) {
            return this.httpErrors.error_400("userId is required");
        }
        try {
            const result = await this.fetchWallet.execute(userId);
            return this.httpSuccess.success_200(result);
        } catch (error) {
            if (error instanceof Error) {
                return this.httpErrors.error_400(error.message);
            }
            return this.httpErrors.error_500("Internal server error");
        }
    }
}
