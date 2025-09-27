import { IController } from "../Interface/IController";
import { IHttpResponse } from "@interfaces/helpers/IHttpResponse";
import { HttpRequest } from "@interfaces/helpers/implementation/HttpRequest";
import { HttpResponse } from "@interfaces/helpers/implementation/HttpResponse";
import { IFetchStripeSessionDetailsUseCase } from "@src/application/usecases/Client/IFetchStripeSessionDetailsUseCase";

export class FetchStripeSessionDetailsController implements IController {
    constructor(
    private FetchStripeSessionDetails: IFetchStripeSessionDetailsUseCase
    ) {}

    async handle(httpRequest: HttpRequest): Promise<IHttpResponse> {
        const session_id = (httpRequest.params as { id?: string })?.id;

        if (!session_id) {
            return new HttpResponse(400, {
                success: false,
                message: "Please provide session id",
            });
        }

        try {
            const response = await this.FetchStripeSessionDetails.execute(session_id);
            return new HttpResponse(200, response);
        } catch (error: any) {
            switch (error.message) {
            case "SECRETKEYNOTFOUND":
                return new HttpResponse(400, {
                    success: false,
                    message: "SecretKey Not Found",
                });
            default:
                return new HttpResponse(500, {
                    success: false,
                    message: "Internal Server Error",
                });
            }
        }
    }
}
