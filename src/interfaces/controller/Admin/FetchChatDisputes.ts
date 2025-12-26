import { IHttpErrors } from "@interfaces/helpers/IHttpErrors.";
import { HttpErrors } from "@interfaces/helpers/implementation/HttpErrors";
import { IHttpSuccess } from "@interfaces/helpers/IHttpSuccess";
import { HttpSuccess } from "@interfaces/helpers/implementation/HttpSuccess";
import { IHttpResponse } from "@interfaces/helpers/IHttpResponse";
import { HttpRequest } from "@interfaces/helpers/implementation/HttpRequest";
import { FetchChatDisputesQueryZodValidator } from "@interfaces/middelwares/validator/zod/admin/FetchChatDisputesZod";
import { IFetchChatDisputesUseCase } from "@src/application/usecases/Admin/IFetchChatDisputesUseCase";
import { IController } from "../Interface/IController";

export class FetchChatDisputesController implements IController {
    constructor(
        private _fetchChatDisputes: IFetchChatDisputesUseCase,
        private _httpErrors: IHttpErrors = new HttpErrors(),
        private _httpSuccess: IHttpSuccess = new HttpSuccess(),
    ) {}
    async handle(httpRequest: HttpRequest): Promise<IHttpResponse> {
        const parsed = FetchChatDisputesQueryZodValidator.safeParse(httpRequest.query);
        if (!parsed.success) {
            const err = parsed.error.errors[0];
            return this._httpErrors.error_400(err.message);
        }
        try {
            const response = await this._fetchChatDisputes.execute(parsed.data);
            return this._httpSuccess.success_200(response);
        } catch (error) {
            if (error instanceof Error) {
                return this._httpErrors.error_400(error.message);
            }
            return this._httpErrors.error_500();
        }
    }
}
