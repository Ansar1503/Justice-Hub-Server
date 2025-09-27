import { IDeletePracticeAreaUsecase } from "@src/application/usecases/PracitceAreas/IDeletePracticeAreaUsecase";
import { IController } from "../Interface/IController";
import { IHttpSuccess } from "@interfaces/helpers/IHttpSuccess";
import { IHttpErrors } from "@interfaces/helpers/IHttpErrors.";
import { IHttpResponse } from "@interfaces/helpers/IHttpResponse";
import { HttpRequest } from "@interfaces/helpers/implementation/HttpRequest";

export class DeletePracticeAreaController implements IController {
    constructor(
    private _deletePracticeArea: IDeletePracticeAreaUsecase,
    private _httpSuccess: IHttpSuccess,
    private _httpErrors: IHttpErrors
    ) {}
    async handle(httpRequest: HttpRequest): Promise<IHttpResponse> {
        let id = "";
        if (
            httpRequest.params &&
      typeof httpRequest.params === "object" &&
      "id" in httpRequest.params
        ) {
            id = String(httpRequest.params.id);
        }
        if (!id) {
            return this._httpErrors.error_400("practice Id is required");
        }
        try {
            const result = await this._deletePracticeArea.execute(id);
            return this._httpSuccess.success_200(result);
        } catch (error) {
            if (error instanceof Error) {
                return this._httpErrors.error_400(error.message);
            }
            return this._httpErrors.error_500();
        }
    }
}
