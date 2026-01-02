"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteSpecializationController = void 0;
class DeleteSpecializationController {
    deleteSpecialization;
    httpErrors;
    httpSuccess;
    constructor(deleteSpecialization, httpErrors, httpSuccess) {
        this.deleteSpecialization = deleteSpecialization;
        this.httpErrors = httpErrors;
        this.httpSuccess = httpSuccess;
    }
    async handle(httpRequest) {
        let id = "";
        if (httpRequest.params && typeof httpRequest.params === "object" && "id" in httpRequest.params) {
            id = String(httpRequest.params.id);
        }
        if (!id) {
            return this.httpErrors.error_400("id not found");
        }
        try {
            const result = await this.deleteSpecialization.execute(id);
            return this.httpSuccess.success_200(result);
        }
        catch (error) {
            if (error instanceof Error) {
                return this.httpErrors.error_400(error.message);
            }
            return this.httpErrors.error_500();
        }
    }
}
exports.DeleteSpecializationController = DeleteSpecializationController;
