"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateBasicInfoController = void 0;
const HttpErrors_1 = require("@interfaces/helpers/implementation/HttpErrors");
const HttpSuccess_1 = require("@interfaces/helpers/implementation/HttpSuccess");
const HttpResponse_1 = require("@interfaces/helpers/implementation/HttpResponse");
class UpdateBasicInfoController {
    _udpateClientData;
    _errors;
    _success;
    constructor(_udpateClientData, _errors = new HttpErrors_1.HttpErrors(), _success = new HttpSuccess_1.HttpSuccess()) {
        this._udpateClientData = _udpateClientData;
        this._errors = _errors;
        this._success = _success;
    }
    async handle(httpRequest) {
        const { name, mobile, dob, gender } = httpRequest.body;
        if (!name || !mobile) {
            const err = this._errors.error_400();
            return new HttpResponse_1.HttpResponse(err.statusCode, err.body);
        }
        const profile_image = httpRequest?.file?.path;
        const user_id = httpRequest?.user?.id;
        try {
            const updateData = await this._udpateClientData.execute({
                profile_image,
                user_id,
                name,
                mobile,
                dob,
                gender,
            });
            if (!updateData) {
                const err = this._errors.error_500();
                return new HttpResponse_1.HttpResponse(err.statusCode, err.body);
            }
            const success = this._success.success_200(updateData);
            return new HttpResponse_1.HttpResponse(success.statusCode, success.body);
        }
        catch (error) {
            if (error instanceof Error) {
                return this._errors.error_400(error.message);
            }
            return this._errors.error_500();
        }
    }
}
exports.UpdateBasicInfoController = UpdateBasicInfoController;
