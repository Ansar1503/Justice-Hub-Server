import { IHttpErrors } from "@interfaces/helpers/IHttpErrors.";
import { IController } from "../Interface/IController";
import { IHttpSuccess } from "@interfaces/helpers/IHttpSuccess";
import { IHttpResponse } from "@interfaces/helpers/IHttpResponse";
import { HttpRequest } from "@interfaces/helpers/implementation/HttpRequest";
import { IAddSpecializationUsecase } from "@src/application/usecases/Specializations/IAddSpecializationUsecase";

export class AddSpecializationController implements IController {
    constructor(
    private AddSpecialization: IAddSpecializationUsecase,
    private httpErrors: IHttpErrors,
    private httpSuccess: IHttpSuccess
    ) {}
    async handle(httpRequest: HttpRequest): Promise<IHttpResponse> {
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
        } catch (error) {
            if (error instanceof Error) {
                return this.httpErrors.error_400(error.message);
            }
            return this.httpErrors.error_500();
        }
    }
}
