import { IHttpResponse } from "@interfaces/helpers/IHttpResponse";
import { HttpRequest } from "@interfaces/helpers/implementation/HttpRequest";
import { IHttpSuccess } from "@interfaces/helpers/IHttpSuccess";
import { IHttpErrors } from "@interfaces/helpers/IHttpErrors.";
import { HttpSuccess } from "@interfaces/helpers/implementation/HttpSuccess";
import { HttpErrors } from "@interfaces/helpers/implementation/HttpErrors";
import { IFetchLawyerDataUseCase } from "@src/application/usecases/Lawyer/IFetchLawyerDataUseCase";
import { IController } from "../Interface/IController";

export class FetchLawyerController implements IController {
    constructor(
        private _FetchLawyer: IFetchLawyerDataUseCase,
        private _httpSuccess: IHttpSuccess = new HttpSuccess(),
        private _httpErrors: IHttpErrors = new HttpErrors(),
    ) {}
    async handle(httpRequest: HttpRequest): Promise<IHttpResponse> {
        let user_id: string = "";
        if (httpRequest.user && typeof httpRequest.user === "object" && "id" in httpRequest.user) {
            user_id = String(httpRequest.user.id);
        }
        if (!user_id) {
            return this._httpErrors.error_400("User_id Not found");
        }
        try {
            const lawyers = await this._FetchLawyer.execute(user_id);
            return this._httpSuccess.success_200(lawyers);
        } catch (error) {
            if (error instanceof Error) {
                return this._httpErrors.error_400(error.message);
            }
            return this._httpErrors.error_500("Something went wrong");
        }
    }
}
