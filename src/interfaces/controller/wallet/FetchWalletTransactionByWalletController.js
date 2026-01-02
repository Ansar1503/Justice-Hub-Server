"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchWalletTransactionByWalletController = void 0;
const HttpErrors_1 = require("@interfaces/helpers/implementation/HttpErrors");
const HttpSuccess_1 = require("@interfaces/helpers/implementation/HttpSuccess");
const fetchWalletTransactionsQuerySchema_1 = require("@interfaces/middelwares/validator/zod/wallet/fetchWalletTransactionsQuerySchema");
class FetchWalletTransactionByWalletController {
    fetchTransactionByWallet;
    httpErrors;
    httpSuccess;
    constructor(fetchTransactionByWallet, httpErrors = new HttpErrors_1.HttpErrors(), httpSuccess = new HttpSuccess_1.HttpSuccess()) {
        this.fetchTransactionByWallet = fetchTransactionByWallet;
        this.httpErrors = httpErrors;
        this.httpSuccess = httpSuccess;
    }
    async handle(httpRequest) {
        let userId = "";
        if (httpRequest.user &&
            typeof httpRequest.user === "object" &&
            "id" in httpRequest.user &&
            typeof httpRequest.user.id === "string") {
            userId = httpRequest.user.id;
        }
        if (!userId) {
            return this.httpErrors.error_400("user id not found");
        }
        const parsed = fetchWalletTransactionsQuerySchema_1.FetchWalletTransactionsQuerySchema.safeParse(httpRequest.query);
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
        }
        catch (error) {
            if (error instanceof Error) {
                return this.httpErrors.error_400(error.message);
            }
            return this.httpErrors.error_500("internal server error");
        }
    }
}
exports.FetchWalletTransactionByWalletController = FetchWalletTransactionByWalletController;
