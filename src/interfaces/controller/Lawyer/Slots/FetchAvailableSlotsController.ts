import { IHttpSuccess } from "@interfaces/helpers/IHttpSuccess";
import { HttpSuccess } from "@interfaces/helpers/implementation/HttpSuccess";
import { IHttpErrors } from "@interfaces/helpers/IHttpErrors.";
import { HttpErrors } from "@interfaces/helpers/implementation/HttpErrors";
import { IHttpResponse } from "@interfaces/helpers/IHttpResponse";
import { HttpRequest } from "@interfaces/helpers/implementation/HttpRequest";
import { IFetchAvailableSlotsUseCase } from "@src/application/usecases/Lawyer/IFetchAvailableSlotsUseCase";
import { IController } from "../../Interface/IController";

export class FetchAvailableSlotsController implements IController {
    constructor(
        private _availableSlots: IFetchAvailableSlotsUseCase,
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
            const response = await this._availableSlots.execute(user_id);
            return this._httpSuccess.success_200({
                success: true,
                message: "fetched data",
                data: response,
            });
        } catch (error) {
            if (error instanceof Error) {
                return this._httpErrors.error_500(error.message);
            }
            return this._httpErrors.error_500();
        }
    }
}
