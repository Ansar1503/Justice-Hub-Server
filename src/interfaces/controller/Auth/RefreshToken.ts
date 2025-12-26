import { IHttpErrors } from "@interfaces/helpers/IHttpErrors.";
import { HttpErrors } from "@interfaces/helpers/implementation/HttpErrors";
import { HttpSuccess } from "@interfaces/helpers/implementation/HttpSuccess";
import { IHttpSuccess } from "@interfaces/helpers/IHttpSuccess";
import { IHttpResponse } from "@interfaces/helpers/IHttpResponse";
import { HttpRequest } from "@interfaces/helpers/implementation/HttpRequest";
import { HttpResponse } from "@interfaces/helpers/implementation/HttpResponse";
import { IUserReAuth } from "@src/application/usecases/Auth/IUserReAuthUseCase";
import { IController } from "../Interface/IController";

export class RefreshToken implements IController {
    constructor(
        private _userReAuth: IUserReAuth,
        private _httpErrors: IHttpErrors = new HttpErrors(),
        private _httpSuccess: IHttpSuccess = new HttpSuccess(),
    ) {}
    async handle(httpRequest: HttpRequest): Promise<IHttpResponse> {
        const token = (httpRequest as Record<string, any>)?.cookies?.refresh;
        if (!token) {
            const err = this._httpErrors.error_400();
            return new HttpResponse(err.statusCode, err.body);
        }
        try {
            const accesstoken = await this._userReAuth.execute(token);
            if (!accesstoken) {
                const err = this._httpErrors.error_400();
                return new HttpResponse(err.statusCode, err.body);
            }
            const success = this._httpSuccess.success_200(accesstoken);
            return new HttpResponse(success.statusCode, success.body);
        } catch (error) {
            const err = this._httpErrors.error_500();
            return new HttpResponse(err.statusCode, err.body);
        }
    }
}
