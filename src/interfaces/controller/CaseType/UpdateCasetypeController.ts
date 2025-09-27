import { IUpdateCaseTypeUsecase } from "@src/application/usecases/CaseType/IUpdatedCaseTypeUsecase";
import { IHttpErrors } from "@interfaces/helpers/IHttpErrors.";
import { IHttpSuccess } from "@interfaces/helpers/IHttpSuccess";
import { IHttpResponse } from "@interfaces/helpers/IHttpResponse";
import { HttpRequest } from "@interfaces/helpers/implementation/HttpRequest";
import { IController } from "../Interface/IController";

export class UpdateCasetypeController implements IController {
    constructor(
        private updateCasetypeUsecase: IUpdateCaseTypeUsecase,
        private httpErrors: IHttpErrors,
        private httpSuccess: IHttpSuccess,
    ) {}
    async handle(httpRequest: HttpRequest): Promise<IHttpResponse> {
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
        } catch (error) {
            if (error instanceof Error) {
                return this.httpErrors.error_400(error.message);
            }
            return this.httpErrors.error_500();
        }
    }
}
