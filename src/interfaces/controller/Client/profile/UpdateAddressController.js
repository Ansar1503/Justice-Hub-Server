"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateAddressController = void 0;
const HttpErrors_1 = require("@interfaces/helpers/implementation/HttpErrors");
const HttpSuccess_1 = require("@interfaces/helpers/implementation/HttpSuccess");
const HttpResponse_1 = require("@interfaces/helpers/implementation/HttpResponse");
class UpdateAddressController {
    updateAddress;
    httpErrors;
    httpSuccess;
    constructor(updateAddress, httpErrors = new HttpErrors_1.HttpErrors(), httpSuccess = new HttpSuccess_1.HttpSuccess()) {
        this.updateAddress = updateAddress;
        this.httpErrors = httpErrors;
        this.httpSuccess = httpSuccess;
    }
    async handle(httpRequest) {
        const req = httpRequest;
        const user_id = req.user?.id;
        const { state, city, locality, pincode } = req.body;
        if (!state && !city && !locality && !pincode) {
            const err = this.httpErrors.error_400();
            return new HttpResponse_1.HttpResponse(err.statusCode, {
                message: "Invalid Credentials",
            });
        }
        try {
            await this.updateAddress.execute({
                user_id,
                city,
                locality,
                pincode,
                state,
            });
            const success = this.httpSuccess.success_200();
            return new HttpResponse_1.HttpResponse(success.statusCode, success.body);
        }
        catch (error) {
            const err = this.httpErrors.error_500();
            return new HttpResponse_1.HttpResponse(err.statusCode, err.body);
        }
    }
}
exports.UpdateAddressController = UpdateAddressController;
