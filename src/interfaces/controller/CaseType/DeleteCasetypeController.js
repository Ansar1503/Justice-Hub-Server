"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteCaseTypeController = void 0;
class DeleteCaseTypeController {
    _deleteUsecase;
    _errors;
    _success;
    constructor(_deleteUsecase, _errors, _success) {
        this._deleteUsecase = _deleteUsecase;
        this._errors = _errors;
        this._success = _success;
    }
    async handle(httpRequest) {
        let id = "";
        if (httpRequest.params && typeof httpRequest.params === "object" && "id" in httpRequest.params) {
            id = String(httpRequest.params.id);
        }
        if (!id) {
            return this._errors.error_400("id is requierd");
        }
        try {
            const result = await this._deleteUsecase.execute(id);
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
exports.DeleteCaseTypeController = DeleteCaseTypeController;
