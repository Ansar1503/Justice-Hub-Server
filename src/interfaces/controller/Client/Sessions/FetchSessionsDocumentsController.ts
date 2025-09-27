import { IController } from "../../Interface/IController";
import { IHttpErrors } from "@interfaces/helpers/IHttpErrors.";
import { IHttpSuccess } from "@interfaces/helpers/IHttpSuccess";
import { HttpErrors } from "@interfaces/helpers/implementation/HttpErrors";
import { HttpSuccess } from "@interfaces/helpers/implementation/HttpSuccess";
import { IHttpResponse } from "@interfaces/helpers/IHttpResponse";
import { HttpRequest } from "@interfaces/helpers/implementation/HttpRequest";
import { HttpResponse } from "@interfaces/helpers/implementation/HttpResponse";
import { IFetchExistingSessionDocumentsUseCase } from "@src/application/usecases/Client/IFetchExistingSessionDocumentUseCase";

export class FetchSessionsDocumentsController implements IController {
    constructor(
    private fetchSessionDocuments: IFetchExistingSessionDocumentsUseCase,
    private httpErrors: IHttpErrors = new HttpErrors(),
    private httpSuccess: IHttpSuccess = new HttpSuccess()
    ) {}

    async handle(httpRequest: HttpRequest): Promise<IHttpResponse> {
        const req = httpRequest as Record<string, any>;
        const { id: session_id } = req.params;
        if (!session_id) {
            return new HttpResponse(400, { message: "session id not found" });
        }

        try {
            const result = await this.fetchSessionDocuments.execute(session_id);
            const success = this.httpSuccess.success_200(result);
            return new HttpResponse(success.statusCode, success.body);
        } catch (error) {
            console.log("error in Fetching session Documents :: ", error);
            if (error instanceof Error) {
                return this.httpErrors.error_400(error.message);
            }
            return this.httpErrors.error_500();
        }
    }
}
