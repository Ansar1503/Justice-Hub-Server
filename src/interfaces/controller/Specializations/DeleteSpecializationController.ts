import { IDeleteSpecializationUsecase } from "@src/application/usecases/Specializations/IDeleteSpecializationUseCase";
import { IHttpResponse } from "@interfaces/helpers/IHttpResponse";
import { HttpRequest } from "@interfaces/helpers/implementation/HttpRequest";
import { IHttpErrors } from "@interfaces/helpers/IHttpErrors.";
import { IHttpSuccess } from "@interfaces/helpers/IHttpSuccess";
import { IController } from "../Interface/IController";

export class DeleteSpecializationController implements IController {
    constructor(
        private _deleteSpecialization: IDeleteSpecializationUsecase,
        private _httpErrors: IHttpErrors,
        private _httpSuccess: IHttpSuccess,
    ) {}
    async handle(httpRequest: HttpRequest): Promise<IHttpResponse> {
        let id = "";
        if (httpRequest.params && typeof httpRequest.params === "object" && "id" in httpRequest.params) {
            id = String(httpRequest.params.id);
        }
        if (!id) {
            return this._httpErrors.error_400("id not found");
        }
        try {
            const result = await this._deleteSpecialization.execute(id);
            return this._httpSuccess.success_200(result);
        } catch (error) {
            if (error instanceof Error) {
                return this._httpErrors.error_400(error.message);
            }
            return this._httpErrors.error_500();
        }
    }
}
