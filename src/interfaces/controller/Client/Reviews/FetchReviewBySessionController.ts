import { IHttpResponse } from "@interfaces/helpers/IHttpResponse";
import { HttpRequest } from "@interfaces/helpers/implementation/HttpRequest";
import { IHttpErrors } from "@interfaces/helpers/IHttpErrors.";
import { IHttpSuccess } from "@interfaces/helpers/IHttpSuccess";
import { HttpErrors } from "@interfaces/helpers/implementation/HttpErrors";
import { HttpSuccess } from "@interfaces/helpers/implementation/HttpSuccess";
import { IFetchReviewsBySessionUseCase } from "@src/application/usecases/Client/IFetchReviewsBySessionUseCase";
import { IController } from "../../Interface/IController";

export class FetchReviewsBySessionController implements IController {
    constructor(
        private fetchReviewBySessionId: IFetchReviewsBySessionUseCase,
        private httpErrors: IHttpErrors = new HttpErrors(),
        private httpSuccess: IHttpSuccess = new HttpSuccess(),
    ) {}

    async handle(httpRequest: HttpRequest): Promise<IHttpResponse> {
        try {
            const sessionId =
                httpRequest.params && typeof httpRequest.params === "object" && "id" in httpRequest.params
                    ? (httpRequest.params as { id: string }).id
                    : undefined;

            if (!sessionId) {
                const error = this.httpErrors.error_400();
                return error;
            }

            const result = await this.fetchReviewBySessionId.execute({
                session_id: sessionId,
            });
            const success = this.httpSuccess.success_200(result);
            return success;
        } catch (error) {
            if (error instanceof Error) {
                return this.httpErrors.error_400(error.message);
            }
            return this.httpErrors.error_500();
        }
    }
}
