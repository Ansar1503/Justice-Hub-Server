import { IHttpErrors } from "@interfaces/helpers/IHttpErrors.";
import { IHttpSuccess } from "@interfaces/helpers/IHttpSuccess";
import { HttpErrors } from "@interfaces/helpers/implementation/HttpErrors";
import { HttpSuccess } from "@interfaces/helpers/implementation/HttpSuccess";
import { IHttpResponse } from "@interfaces/helpers/IHttpResponse";
import { HttpRequest } from "@interfaces/helpers/implementation/HttpRequest";
import { HttpResponse } from "@interfaces/helpers/implementation/HttpResponse";
import { IFetchExistingSessionDocumentsUseCase } from "@src/application/usecases/Client/IFetchExistingSessionDocumentUseCase";
import { IController } from "../../Interface/IController";

export class FetchSessionsDocumentsController implements IController {
    constructor(
        private _fetchSessionDocuments: IFetchExistingSessionDocumentsUseCase,
        private _httpErrors: IHttpErrors = new HttpErrors(),
        private _httpSuccess: IHttpSuccess = new HttpSuccess(),
    ) {}

    async handle(httpRequest: HttpRequest): Promise<IHttpResponse> {
        const req = httpRequest as Record<string, any>;
        const { id: session_id } = req.params;
        if (!session_id) {
            return new HttpResponse(400, { message: "session id not found" });
        }

        try {
            const result = await this._fetchSessionDocuments.execute(session_id);
            const success = this._httpSuccess.success_200(result);
            return new HttpResponse(success.statusCode, success.body);
        } catch (error) {
            if (error instanceof Error) {
                return this._httpErrors.error_400(error.message);
            }
            return this._httpErrors.error_500();
        }
    }
}
