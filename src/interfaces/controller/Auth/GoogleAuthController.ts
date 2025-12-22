import { IGoogleAuthUsecase } from "@src/application/usecases/Auth/IgoogleAuthUsecase";
import { IController } from "../Interface/IController";
import { IHttpErrors } from "@interfaces/helpers/IHttpErrors.";
import { IHttpSuccess } from "@interfaces/helpers/IHttpSuccess";
import { IHttpResponse } from "@interfaces/helpers/IHttpResponse";
import { HttpRequest } from "@interfaces/helpers/implementation/HttpRequest";

export class GoogleAuthController implements IController {
    constructor(private _authUsecase: IGoogleAuthUsecase, private _errors: IHttpErrors, private _success: IHttpSuccess) { }
    async handle(httpRequest: HttpRequest): Promise<IHttpResponse> {
        let credential = ""
        if (httpRequest.body && typeof httpRequest.body === "object" && "credential" in httpRequest.body) {
            credential = String(httpRequest.body.credential)
        }
        if (!credential) {
            return this._errors.error_400("no credential found")
        }
        try {
            const result = await this._authUsecase.execute({ credential })
            return this._success.success_200({
                success: true,
                message: "Google Auth Success",
                accesstoken: result.accesstoken,
                refreshToken: result.refreshToken,
                user: result.user
            })
        } catch (error) {
            console.log(error)
            if (error instanceof Error) {
                return this._errors.error_400(error.message)
            }
            return this._errors.error_500()
        }
    }
}