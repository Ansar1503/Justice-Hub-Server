import { IAddPracticeAreasUsecase } from "@src/application/usecases/PracitceAreas/IAddPracticeAreasUseCase";
import { IHttpSuccess } from "@interfaces/helpers/IHttpSuccess";
import { IHttpErrors } from "@interfaces/helpers/IHttpErrors.";
import { IHttpResponse } from "@interfaces/helpers/IHttpResponse";
import { HttpRequest } from "@interfaces/helpers/implementation/HttpRequest";
import { IController } from "../Interface/IController";

export class AddPracticeAreaController implements IController {
    constructor(
        private _addPracticeArea: IAddPracticeAreasUsecase,
        private _httpSuccess: IHttpSuccess,
        private _httpErrors: IHttpErrors,
    ) {}
    async handle(httpRequest: HttpRequest): Promise<IHttpResponse> {
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
            return this._httpErrors.error_400("specification Id is required");
        }
        if (!name.trim()) {
            return this._httpErrors.error_400("name is required");
        }
        try {
            const result = await this._addPracticeArea.execute({ name, specId });
            return this._httpSuccess.success_200(result);
        } catch (error) {
            if (error instanceof Error) {
                return this._httpErrors.error_400(error.message);
            }
            return this._httpErrors.error_500();
        }
    }
}
