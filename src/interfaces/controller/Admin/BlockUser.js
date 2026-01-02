"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlockUser = void 0;
const HttpErrors_1 = require("@interfaces/helpers/implementation/HttpErrors");
const HttpSuccess_1 = require("@interfaces/helpers/implementation/HttpSuccess");
const HttpResponse_1 = require("@interfaces/helpers/implementation/HttpResponse");
const WinstonLoggerConfig_1 = require("@shared/utils/Winston/WinstonLoggerConfig");
class BlockUser {
    _blockUserUseCase;
    _errors;
    _success;
    constructor(_blockUserUseCase, _errors = new HttpErrors_1.HttpErrors(), _success = new HttpSuccess_1.HttpSuccess()) {
        this._blockUserUseCase = _blockUserUseCase;
        this._errors = _errors;
        this._success = _success;
    }
    async handle(httpRequest) {
        const { user_id, status } = httpRequest.body;
        if (!user_id) {
            WinstonLoggerConfig_1.WLogger.warn("userId not found", {
                controller: "BlockUser",
                role: "admin",
            });
            const error = this._errors.error_400();
            return new HttpResponse_1.HttpResponse(error.statusCode, "user Id not found");
        }
        if (status === undefined || status === null || status === "") {
            WinstonLoggerConfig_1.WLogger.warn("StatusNotFound", {
                controller: "blockUser",
                role: "admin",
            });
            return this._errors.error_400("status not found");
        }
        try {
            const result = await this._blockUserUseCase.execute({
                status: typeof status === "boolean" ? status : Boolean(status),
                user_id,
            });
            WinstonLoggerConfig_1.WLogger.info("BlockUser executed successfully", {
                controller: "BlockUser",
                user_id,
                new_status: result?.status,
            });
            const body = {
                success: true,
                message: `user ${result?.status ? "blocked" : "unblocked"}`,
                data: result,
            };
            const success = this._success.success_200(body);
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
exports.BlockUser = BlockUser;
