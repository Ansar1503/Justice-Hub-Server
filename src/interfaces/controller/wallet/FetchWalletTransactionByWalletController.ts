import { IHttpResponse } from "@interfaces/helpers/IHttpResponse";
import { HttpRequest } from "@interfaces/helpers/implementation/HttpRequest";
import { IFetchWalletTransactionsByWallet } from "@src/application/usecases/Wallet/IFetchWalletTransactionsByWallet";
import { IHttpErrors } from "@interfaces/helpers/IHttpErrors.";
import { HttpErrors } from "@interfaces/helpers/implementation/HttpErrors";
import { IHttpSuccess } from "@interfaces/helpers/IHttpSuccess";
import { HttpSuccess } from "@interfaces/helpers/implementation/HttpSuccess";
import { FetchWalletTransactionsQuerySchema } from "@interfaces/middelwares/validator/zod/wallet/fetchWalletTransactionsQuerySchema";
import { IController } from "../Interface/IController";

export class FetchWalletTransactionByWalletController implements IController {
    constructor(
    private fetchTransactionByWallet: IFetchWalletTransactionsByWallet,
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
            return this.httpErrors.error_400("user id not found");
        }

        const parsed = FetchWalletTransactionsQuerySchema.safeParse(
            httpRequest.query
        );
        if (!parsed.success) {
            const err = parsed.error.errors[0];
            return this.httpErrors.error_400(err.message);
        }
        try {
            const result = await this.fetchTransactionByWallet.execute({
                ...parsed.data,
                userId,
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
