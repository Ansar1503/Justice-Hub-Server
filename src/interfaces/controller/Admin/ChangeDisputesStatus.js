"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChangeDisputesStatusController = void 0;
const HttpSuccess_1 = require("@interfaces/helpers/implementation/HttpSuccess");
const HttpErrors_1 = require("@interfaces/helpers/implementation/HttpErrors");
class ChangeDisputesStatusController {
    changeDisputesStatus;
    httpSuccess;
    httpError;
    constructor(changeDisputesStatus, httpSuccess = new HttpSuccess_1.HttpSuccess(), httpError = new HttpErrors_1.HttpErrors()) {
        this.changeDisputesStatus = changeDisputesStatus;
        this.httpSuccess = httpSuccess;
        this.httpError = httpError;
    }
    async handle(httpRequest) {
        let dispute_id = "";
        let action = "";
        let status = "";
        if (httpRequest.params && typeof httpRequest.params === "object" && "id" in httpRequest.params) {
            dispute_id = String(httpRequest.params.id);
        }
        if (httpRequest.body && typeof httpRequest.body === "object") {
            if ("action" in httpRequest.body && typeof httpRequest.body.action === "string") {
                if (httpRequest.body.action === "deleted") {
                    action = httpRequest.body.action;
                }
                else if (httpRequest.body.action === "blocked") {
                    action = httpRequest.body.action;
                }
            }
            if ("status" in httpRequest.body && typeof httpRequest.body.status === "string") {
                if (httpRequest.body.status === "pending") {
                    status = httpRequest.body.status;
                }
                else if (httpRequest.body.status === "resolved") {
                    status = httpRequest.body.status;
                }
                else if (httpRequest.body.status === "rejected") {
                    status = httpRequest.body.status;
                }
            }
        }
        if (!dispute_id) {
            return this.httpError.error_400("id is required");
        }
        if (!status) {
            return this.httpError.error_400("status is required");
        }
        try {
            const result = await this.changeDisputesStatus.execute({
                action: action ? action : undefined,
                disputesId: dispute_id,
                status,
            });
            return this.httpSuccess.success_200(result);
        }
        catch (error) {
            if (error instanceof Error) {
                return this.httpError.error_400(error.message);
            }
            return this.httpError.error_500("An error occurred");
        }
    }
}
exports.ChangeDisputesStatusController = ChangeDisputesStatusController;
