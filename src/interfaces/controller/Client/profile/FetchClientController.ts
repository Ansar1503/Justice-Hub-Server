import { IHttpResponse } from "@interfaces/helpers/IHttpResponse";
import { HttpRequest } from "@interfaces/helpers/implementation/HttpRequest";
import { IHttpErrors } from "@interfaces/helpers/IHttpErrors.";
import { HttpErrors } from "@interfaces/helpers/implementation/HttpErrors";
import { IHttpSuccess } from "@interfaces/helpers/IHttpSuccess";
import { HttpSuccess } from "@interfaces/helpers/implementation/HttpSuccess";
import { HttpResponse } from "@interfaces/helpers/implementation/HttpResponse";
import { IFetchClientDataUseCase } from "@src/application/usecases/Client/IFetchClientData";
import { IController } from "../../Interface/IController";

export class FetchClientDataController implements IController {
    constructor(
        private fetchClientData: IFetchClientDataUseCase,
        private httpErrors: IHttpErrors = new HttpErrors(),
        private httpSuccess: IHttpSuccess = new HttpSuccess(),
    ) { }
    async handle(httpRequest: HttpRequest): Promise<IHttpResponse> {
        const user_id = (httpRequest as Record<string, any>)?.user?.id;
        if (!user_id) {
            const err = this.httpErrors.error_400();
            return new HttpResponse(err.statusCode, err.body);
        }
        try {
            const clientDetails = await this.fetchClientData.execute(user_id);
            if (!clientDetails) {
                const err = this.httpErrors.error_400();
                return new HttpResponse(err.statusCode, err.body);
            }
            const success = this.httpSuccess.success_200(clientDetails);
            // console.log("success:", success);
            return new HttpResponse(success.statusCode, success.body);
        } catch (error) {
            const err = this.httpErrors.error_500();
            return new HttpResponse(err.statusCode, err.body);
        }
    }
}
