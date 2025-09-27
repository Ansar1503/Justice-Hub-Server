import { IController } from "@interfaces/controller/Interface/IController";
import { IHttpErrors } from "@interfaces/helpers/IHttpErrors.";
import { IHttpResponse } from "@interfaces/helpers/IHttpResponse";
import { IHttpSuccess } from "@interfaces/helpers/IHttpSuccess";
import { HttpRequest } from "@interfaces/helpers/implementation/HttpRequest";
import { IFetchProfileImageUsecase } from "@src/application/usecases/Client/IFetchProfileImageUsecase";

export class FetchProfileImageController implements IController {
    constructor(
        private _fetchProfile: IFetchProfileImageUsecase,
        private _errors: IHttpErrors,
        private _success: IHttpSuccess,
    ) {}
    async handle(httpRequest: HttpRequest): Promise<IHttpResponse> {
        let userId = "";
        if (httpRequest.user && typeof httpRequest.user === "object" && "id" in httpRequest.user) {
            userId = String(httpRequest.user.id);
        }
        if (!userId) {
            return this._errors.error_400("userId is required");
        }
        try {
            const res = await this._fetchProfile.execute(userId);
            return this._success.success_200(res);
        } catch (error) {
            if (error instanceof Error) {
                return this._errors.error_400(error.message);
            }
            return this._errors.error_500();
        }
    }
}
