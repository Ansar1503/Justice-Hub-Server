"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeletePracticeAreaController = void 0;
class DeletePracticeAreaController {
    _deletePracticeArea;
    _httpSuccess;
    _httpErrors;
    constructor(_deletePracticeArea, _httpSuccess, _httpErrors) {
        this._deletePracticeArea = _deletePracticeArea;
        this._httpSuccess = _httpSuccess;
        this._httpErrors = _httpErrors;
    }
    async handle(httpRequest) {
        let id = "";
        if (httpRequest.params && typeof httpRequest.params === "object" && "id" in httpRequest.params) {
            id = String(httpRequest.params.id);
        }
        if (!id) {
            return this._httpErrors.error_400("practice Id is required");
        }
        try {
            const result = await this._deletePracticeArea.execute(id);
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
exports.DeletePracticeAreaController = DeletePracticeAreaController;
