"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchCaseByCaseTypesIdsController = void 0;
const FetchingCaseByCaseTypesSchema_1 = require("@interfaces/middelwares/validator/zod/Cases/FetchingCaseByCaseTypesSchema");
const WinstonLoggerConfig_1 = require("@shared/utils/Winston/WinstonLoggerConfig");
class FetchCaseByCaseTypesIdsController {
    _fetchCasesByCaseType;
    _errors;
    _success;
    constructor(_fetchCasesByCaseType, _errors, _success) {
        this._fetchCasesByCaseType = _fetchCasesByCaseType;
        this._errors = _errors;
        this._success = _success;
    }
    async handle(httpRequest) {
        let userId = "";
        if (httpRequest.user &&
            typeof httpRequest.user === "object" &&
            "id" in httpRequest.user) {
            userId = String(httpRequest.user.id);
        }
        console.log("reached cnotroller now to parse");
        const parsed = await FetchingCaseByCaseTypesSchema_1.FetchCaseByCaseTypesSchema.safeParse(httpRequest.query);
        if (!userId) {
            WinstonLoggerConfig_1.WLogger.warn("user id not found", {
                page: "FetchCaseByCaseTypeIdsController",
            });
            return this._errors.error_400("user Id not found");
        }
        if (!parsed.success) {
            const er = parsed.error.errors[0];
            WinstonLoggerConfig_1.WLogger.warn(er);
            return this._errors.error_400(er.message);
        }
        if (parsed.data.caseTypeIds.length === 0) {
            WinstonLoggerConfig_1.WLogger.warn("no casetypes found", {
                page: "FetchCaseByCaseTypeIdsController",
            });
            return this._errors.error_400("no casetypes found");
        }
        try {
            const result = await this._fetchCasesByCaseType.execute({
                caseTypeIds: parsed.data.caseTypeIds,
                userId: userId,
            });
            return this._success.success_200(result);
        }
        catch (error) {
            WinstonLoggerConfig_1.WLogger.warn(error);
            if (error instanceof Error) {
                return this._errors.error_400(error.message);
            }
            return this._errors.error_500();
        }
    }
}
exports.FetchCaseByCaseTypesIdsController = FetchCaseByCaseTypesIdsController;
