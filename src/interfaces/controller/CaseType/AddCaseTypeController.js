"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddCasetypeController = void 0;
class AddCasetypeController {
    AddCasetype;
    httpErrors;
    httpSuccess;
    constructor(AddCasetype, httpErrors, httpSuccess) {
        this.AddCasetype = AddCasetype;
        this.httpErrors = httpErrors;
        this.httpSuccess = httpSuccess;
    }
    async handle(httpRequest) {
        let name = "";
        let practiceid = "";
        if (httpRequest.body && typeof httpRequest.body === "object") {
            if ("name" in httpRequest.body) {
                name = String(httpRequest.body.name);
            }
            if ("pid" in httpRequest.body) {
                practiceid = String(httpRequest.body.pid);
            }
        }
        if (!name) {
            return this.httpErrors.error_400("name field is required");
        }
        if (!practiceid) {
            return this.httpErrors.error_400("practice area Id is required");
        }
        try {
            const result = await this.AddCasetype.execute({
                name,
                practiceareaId: practiceid,
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
exports.AddCasetypeController = AddCasetypeController;
