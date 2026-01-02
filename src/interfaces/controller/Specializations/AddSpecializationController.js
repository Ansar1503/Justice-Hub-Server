"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddSpecializationController = void 0;
class AddSpecializationController {
    AddSpecialization;
    httpErrors;
    httpSuccess;
    constructor(AddSpecialization, httpErrors, httpSuccess) {
        this.AddSpecialization = AddSpecialization;
        this.httpErrors = httpErrors;
        this.httpSuccess = httpSuccess;
    }
    async handle(httpRequest) {
        let id = "";
        let name = "";
        if (httpRequest.body && typeof httpRequest.body === "object") {
            if ("id" in httpRequest.body) {
                id = String(httpRequest.body.id);
            }
            if ("name" in httpRequest.body) {
                name = String(httpRequest.body.name);
            }
        }
        if (!name.trim()) {
            return this.httpErrors.error_400("Please provied a name");
        }
        try {
            const result = await this.AddSpecialization.execute({ name, id });
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
exports.AddSpecializationController = AddSpecializationController;
