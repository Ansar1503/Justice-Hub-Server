import { IController } from "@interfaces/controller/Interface/IController";
import { IHttpErrors } from "@interfaces/helpers/IHttpErrors.";
import { IHttpResponse } from "@interfaces/helpers/IHttpResponse";
import { IHttpSuccess } from "@interfaces/helpers/IHttpSuccess";
import { HttpErrors } from "@interfaces/helpers/implementation/HttpErrors";
import { HttpRequest } from "@interfaces/helpers/implementation/HttpRequest";
import { HttpResponse } from "@interfaces/helpers/implementation/HttpResponse";
import { HttpSuccess } from "@interfaces/helpers/implementation/HttpSuccess";
import { AppError } from "@interfaces/middelwares/Error/CustomError";
import { ICancelSessionUseCase } from "@src/application/usecases/Lawyer/ICancellSessionUseCase";

export class CancelSessionController implements IController {
    constructor(
        private cancelSession: ICancelSessionUseCase,
        private httpSuccess: IHttpSuccess = new HttpSuccess(),
        private httpErrors: IHttpErrors = new HttpErrors(),
    ) {}
    async handle(httpRequest: HttpRequest): Promise<IHttpResponse> {
        let id: string = "";
        if (httpRequest.body && typeof httpRequest.body === "object" && "id" in httpRequest.body) {
            id = String(httpRequest.body.id);
        }
        try {
            const result = await this.cancelSession.execute({ session_id: id });
            return this.httpSuccess.success_200(result);
        } catch (error) {
            console.log("error:", error);
            if (error instanceof AppError) {
                return new HttpResponse(error.statusCode, error.message);
            }
            return this.httpErrors.error_500();
        }
    }
}
