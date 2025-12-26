import { IHttpResponse } from "@interfaces/helpers/IHttpResponse";
import { HttpRequest } from "@interfaces/helpers/implementation/HttpRequest";
import { IFetchReviewDisputesUseCase } from "@src/application/usecases/Admin/IFetchReviewDisputesUseCase";
import { zodReviewDisputesQuerySchema } from "@interfaces/middelwares/validator/zod/zod.validate";
import { IHttpSuccess } from "@interfaces/helpers/IHttpSuccess";
import { HttpSuccess } from "@interfaces/helpers/implementation/HttpSuccess";
import { IHttpErrors } from "@interfaces/helpers/IHttpErrors.";
import { HttpErrors } from "@interfaces/helpers/implementation/HttpErrors";
import { IController } from "../Interface/IController";

export class FetchReviewDisputes implements IController {
    constructor(
        private _FetchReviewDisputesUseCase: IFetchReviewDisputesUseCase,
        private _httpSuccess: IHttpSuccess = new HttpSuccess(),
        private _httpErrors: IHttpErrors = new HttpErrors(),
    ) {}
    async handle(httpRequest: HttpRequest): Promise<IHttpResponse> {
        const parsedData = zodReviewDisputesQuerySchema.safeParse(httpRequest.query);
        if (!parsedData.success) {
            // console.log("parsed Error :", parsedData.error);
            const err = parsedData.error.errors[0].message;
            return this._httpErrors.error_400(err);
        }
        try {
            const result = await this._FetchReviewDisputesUseCase.execute(parsedData.data);
            const success = this._httpSuccess.success_200(result);
            return success;
        } catch (error) {
            if (error instanceof Error) {
                return this._httpErrors.error_400(error.message);
            }
            return this._httpErrors.error_500();
        }
    }
}
