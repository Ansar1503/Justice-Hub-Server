import { IHttpResponse } from "@interfaces/helpers/IHttpResponse";
import { HttpRequest } from "@interfaces/helpers/implementation/HttpRequest";
import { IFetchWalletByUser } from "@src/application/usecases/Wallet/IFetchWalletByUser";
import { IHttpErrors } from "@interfaces/helpers/IHttpErrors.";
import { HttpErrors } from "@interfaces/helpers/implementation/HttpErrors";
import { IHttpSuccess } from "@interfaces/helpers/IHttpSuccess";
import { HttpSuccess } from "@interfaces/helpers/implementation/HttpSuccess";
import { IController } from "../Interface/IController";

export class FetchWalletByUserController implements IController {
    constructor(
        private _fetchWallet: IFetchWalletByUser,
        private _httpErrors: IHttpErrors = new HttpErrors(),
        private _httpSuccess: IHttpSuccess = new HttpSuccess(),
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
            return this._httpErrors.error_400("userId is required");
        }
        try {
            const result = await this._fetchWallet.execute(userId);
            return this._httpSuccess.success_200(result);
        } catch (error) {
            if (error instanceof Error) {
                return this._httpErrors.error_400(error.message);
            }
            return this._httpErrors.error_500("Internal server error");
        }
    }
}
