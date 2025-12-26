import { IController } from "@interfaces/controller/Interface/IController";
import { IHttpErrors } from "@interfaces/helpers/IHttpErrors.";
import { IHttpResponse } from "@interfaces/helpers/IHttpResponse";
import { IHttpSuccess } from "@interfaces/helpers/IHttpSuccess";
import { HttpErrors } from "@interfaces/helpers/implementation/HttpErrors";
import { HttpRequest } from "@interfaces/helpers/implementation/HttpRequest";
import { HttpSuccess } from "@interfaces/helpers/implementation/HttpSuccess";
import { AppError } from "@interfaces/middelwares/Error/CustomError";
import { IJoinSessionUseCase } from "@src/application/usecases/Lawyer/IJoinSessionUseCase";

export class JoinVideoSessionController implements IController {
    constructor(
        private _JoinSession: IJoinSessionUseCase,
        private _httpSuccess: IHttpSuccess = new HttpSuccess(),
        private _httpErrors: IHttpErrors = new HttpErrors(),
    ) {}
    async handle(httpRequest: HttpRequest): Promise<IHttpResponse> {
        let sessionId: string = "";
        if (httpRequest.body && typeof httpRequest.body === "object" && "sessionId" in httpRequest.body) {
            sessionId = String(httpRequest.body.sessionId);
        }
        try {
            const result = await this._JoinSession.execute({ sessionId });
            return this._httpSuccess.success_200(result);
        } catch (error) {
            if (error instanceof AppError) {
                return this._httpErrors.error_400(error.message);
            }
            return this._httpErrors.error_500();
        }
    }
}
