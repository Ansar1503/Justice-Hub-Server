"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchWalletByUserController = void 0;
const HttpErrors_1 = require("@interfaces/helpers/implementation/HttpErrors");
const HttpSuccess_1 = require("@interfaces/helpers/implementation/HttpSuccess");
class FetchWalletByUserController {
    fetchWallet;
    httpErrors;
    httpSuccess;
    constructor(fetchWallet, httpErrors = new HttpErrors_1.HttpErrors(), httpSuccess = new HttpSuccess_1.HttpSuccess()) {
        this.fetchWallet = fetchWallet;
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
            return this.httpErrors.error_400("userId is required");
        }
        try {
            const result = await this.fetchWallet.execute(userId);
            return this.httpSuccess.success_200(result);
        }
        catch (error) {
            if (error instanceof Error) {
                return this.httpErrors.error_400(error.message);
            }
            return this.httpErrors.error_500("Internal server error");
        }
    }
}
exports.FetchWalletByUserController = FetchWalletByUserController;
