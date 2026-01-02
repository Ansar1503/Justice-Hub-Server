"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatePracticeAreaController = void 0;
class UpdatePracticeAreaController {
    _updatePracticeAreasUsecase;
    _httpSuccess;
    _httpErrors;
    constructor(_updatePracticeAreasUsecase, _httpSuccess, _httpErrors) {
        this._updatePracticeAreasUsecase = _updatePracticeAreasUsecase;
        this._httpSuccess = _httpSuccess;
        this._httpErrors = _httpErrors;
    }
    async handle(httpRequest) {
        let specId = "";
        let id = "";
        let name = "";
        if (httpRequest.body && typeof httpRequest.body === "object") {
            if ("id" in httpRequest.body) {
                id = String(httpRequest.body.id);
            }
            if ("specId" in httpRequest.body) {
                specId = String(httpRequest.body.specId);
            }
            if ("name" in httpRequest.body) {
                name = String(httpRequest.body.name);
            }
        }
        if (!id) {
            return this._httpErrors.error_400("id is required");
        }
        if (!specId) {
            return this._httpErrors.error_400("specification id is required");
        }
        if (!name) {
            return this._httpErrors.error_400("name is required");
        }
        try {
            const result = await this._updatePracticeAreasUsecase.execute({
                id,
                name,
                specId,
            });
            return this._httpSuccess.success_200(result);
        }
        catch (error) {
            if (error instanceof Error) {
                return this._httpErrors.error_400(error.message);
            }
            return this._httpErrors.error_500();
        }
    }
}
exports.UpdatePracticeAreaController = UpdatePracticeAreaController;
