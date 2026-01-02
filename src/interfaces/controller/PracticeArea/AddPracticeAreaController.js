"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddPracticeAreaController = void 0;
class AddPracticeAreaController {
    addPracticeArea;
    httpSuccess;
    httpErrors;
    constructor(addPracticeArea, httpSuccess, httpErrors) {
        this.addPracticeArea = addPracticeArea;
        this.httpSuccess = httpSuccess;
        this.httpErrors = httpErrors;
    }
    async handle(httpRequest) {
        let specId = "";
        let name = "";
        if (httpRequest.body && typeof httpRequest.body === "object") {
            if ("specId" in httpRequest.body) {
                specId = String(httpRequest.body.specId);
            }
            if ("name" in httpRequest.body) {
                name = String(httpRequest.body.name);
            }
        }
        if (!specId.trim()) {
            return this.httpErrors.error_400("specification Id is required");
        }
        if (!name.trim()) {
            return this.httpErrors.error_400("name is required");
        }
        try {
            const result = await this.addPracticeArea.execute({ name, specId });
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
exports.AddPracticeAreaController = AddPracticeAreaController;
