"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchClientDataController = void 0;
const HttpErrors_1 = require("@interfaces/helpers/implementation/HttpErrors");
const HttpSuccess_1 = require("@interfaces/helpers/implementation/HttpSuccess");
const HttpResponse_1 = require("@interfaces/helpers/implementation/HttpResponse");
class FetchClientDataController {
    fetchClientData;
    httpErrors;
    httpSuccess;
    constructor(fetchClientData, httpErrors = new HttpErrors_1.HttpErrors(), httpSuccess = new HttpSuccess_1.HttpSuccess()) {
        this.fetchClientData = fetchClientData;
        this.httpErrors = httpErrors;
        this.httpSuccess = httpSuccess;
    }
    async handle(httpRequest) {
        const user_id = httpRequest?.user?.id;
        if (!user_id) {
            const err = this.httpErrors.error_400();
            return new HttpResponse_1.HttpResponse(err.statusCode, err.body);
        }
        try {
            const clientDetails = await this.fetchClientData.execute(user_id);
            if (!clientDetails) {
                const err = this.httpErrors.error_400();
                return new HttpResponse_1.HttpResponse(err.statusCode, err.body);
            }
            const success = this.httpSuccess.success_200(clientDetails);
            // console.log("success:", success);
            return new HttpResponse_1.HttpResponse(success.statusCode, success.body);
        }
        catch (error) {
            const err = this.httpErrors.error_500();
            return new HttpResponse_1.HttpResponse(err.statusCode, err.body);
        }
    }
}
exports.FetchClientDataController = FetchClientDataController;
