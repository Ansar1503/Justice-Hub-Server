"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchAmountPayableController = void 0;
class FetchAmountPayableController {
    _fetchAmountPayable;
    _errors;
    _success;
    constructor(_fetchAmountPayable, _errors, _success) {
        this._fetchAmountPayable = _fetchAmountPayable;
        this._errors = _errors;
        this._success = _success;
    }
    async handle(httpRequest) {
        let userId = "";
        let lawyerId = "";
        let type = "consultation";
        if (httpRequest.user &&
            typeof httpRequest.user === "object" &&
            "id" in httpRequest.user) {
            userId = String(httpRequest.user.id);
        }
        if (httpRequest.params &&
            typeof httpRequest.params === "object" &&
            "id" in httpRequest.params) {
            lawyerId = String(httpRequest.params.id);
        }
        if (httpRequest.query &&
            typeof httpRequest.query === "object" &&
            "type" in httpRequest.query) {
            if (typeof httpRequest.query.type === "string") {
                if (httpRequest.query.type === "follow-up") {
                    type = httpRequest.query.type;
                }
            }
        }
        try {
            const result = await this._fetchAmountPayable.execute({
                appointmentType: type,
                clientId: userId,
                lawyerId: lawyerId,
            });
            return this._success.success_200(result);
        }
        catch (error) {
            if (error instanceof Error) {
                return this._errors.error_400(error.message);
            }
            return this._errors.error_500();
        }
    }
}
exports.FetchAmountPayableController = FetchAmountPayableController;
