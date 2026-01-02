"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateCasetypeController = void 0;
class UpdateCasetypeController {
    updateCasetypeUsecase;
    httpErrors;
    httpSuccess;
    constructor(updateCasetypeUsecase, httpErrors, httpSuccess) {
        this.updateCasetypeUsecase = updateCasetypeUsecase;
        this.httpErrors = httpErrors;
        this.httpSuccess = httpSuccess;
    }
    async handle(httpRequest) {
        let id = "";
        let name = "";
        let practiceId = "";
        if (httpRequest.body && typeof httpRequest.body === "object") {
            if ("id" in httpRequest.body) {
                id = String(httpRequest.body.id);
            }
            if ("name" in httpRequest.body) {
                name = String(httpRequest.body.name);
            }
            if ("pid" in httpRequest.body) {
                practiceId = String(httpRequest.body.pid);
            }
        }
        if (!id.trim()) {
            return this.httpErrors.error_400("no id is found.");
        }
        if (!name.trim()) {
            return this.httpErrors.error_400("name is not required");
        }
        if (!practiceId) {
            return this.httpErrors.error_400("practice id is required");
        }
        try {
            const result = await this.updateCasetypeUsecase.execute({
                id,
                name,
                practiceareaId: practiceId,
            });
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
exports.UpdateCasetypeController = UpdateCasetypeController;
