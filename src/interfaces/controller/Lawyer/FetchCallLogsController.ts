import { IHttpSuccess } from "@interfaces/helpers/IHttpSuccess";
import { HttpSuccess } from "@interfaces/helpers/implementation/HttpSuccess";
import { IHttpErrors } from "@interfaces/helpers/IHttpErrors.";
import { HttpErrors } from "@interfaces/helpers/implementation/HttpErrors";
import { IHttpResponse } from "@interfaces/helpers/IHttpResponse";
import { HttpRequest } from "@interfaces/helpers/implementation/HttpRequest";
import { AppError } from "@interfaces/middelwares/Error/CustomError";
import { HttpResponse } from "@interfaces/helpers/implementation/HttpResponse";
import { IFetchCallLogsUseCase } from "@src/application/usecases/Lawyer/IFetchCallLogsUseCase";
import { IController } from "../Interface/IController";

export class FetchCallLogsController implements IController {
    constructor(
        private _FetchCallLogs: IFetchCallLogsUseCase,
        private _httpSuccess: IHttpSuccess = new HttpSuccess(),
        private _httpErrors: IHttpErrors = new HttpErrors(),
    ) {}
    async handle(httpRequest: HttpRequest): Promise<IHttpResponse> {
        let id: string = "";
        let page: number = 1;
        let limit: number = 10;
        if (httpRequest.params && typeof httpRequest.params === "object" && "id" in httpRequest.params) {
            id = String(httpRequest.params.id);
        }
        if (httpRequest.query && typeof httpRequest.query === "object") {
            if ("page" in httpRequest.query) {
                page = !isNaN(Number(httpRequest.query.page)) ? Number(httpRequest.query.page) : 1;
            }
            if ("limit" in httpRequest.query) {
                limit = !isNaN(Number(httpRequest.query.limit)) ? Number(httpRequest.query.limit) : 10;
            }
        }
        if (!id) {
            return this._httpErrors.error_400("session id is required");
        }
        try {
            const result = await this._FetchCallLogs.execute({
                limit,
                page,
                sessionId: id,
            });
            return this._httpSuccess.success_200(result);
        } catch (error) {
            if (error instanceof AppError) {
                return new HttpResponse(error.statusCode, error.message);
            }
            return this._httpErrors.error_500();
        }
    }
}
