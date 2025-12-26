import { IHttpResponse } from "@interfaces/helpers/IHttpResponse";
import { HttpRequest } from "@interfaces/helpers/implementation/HttpRequest";
import { IChatusecase } from "@src/application/usecases/IUseCases/IChatusecase";
import { IHttpErrors } from "@interfaces/helpers/IHttpErrors.";
import { IHttpSuccess } from "@interfaces/helpers/IHttpSuccess";
import { HttpErrors } from "@interfaces/helpers/implementation/HttpErrors";
import { HttpSuccess } from "@interfaces/helpers/implementation/HttpSuccess";
import { IController } from "../Interface/IController";

export class GetMessages implements IController {
    constructor(
        private readonly _chatUseCase: IChatusecase,
        private _httpErrors: IHttpErrors = new HttpErrors(),
        private _httpSuccess: IHttpSuccess = new HttpSuccess(),
    ) {}
    async handle(httpRequest: HttpRequest): Promise<IHttpResponse> {
        try {
            const { cursor, sId } = httpRequest.query as {
                cursor?: string | number;
                sId?: string | number;
            };
            const result = await this._chatUseCase.fetchChatMessages({
                page: Number(cursor),
                session_id: String(sId),
            });
            return this._httpSuccess.success_200(result);
        } catch (error) {
            return this._httpErrors.error_500();
        }
    }
}
