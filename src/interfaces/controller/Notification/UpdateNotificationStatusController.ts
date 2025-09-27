import { IUpdateNotificationStatus } from "@src/application/usecases/Notification/IUpdateNotificationStatus";
import { IHttpErrors } from "@interfaces/helpers/IHttpErrors.";
import { HttpErrors } from "@interfaces/helpers/implementation/HttpErrors";
import { IHttpSuccess } from "@interfaces/helpers/IHttpSuccess";
import { HttpSuccess } from "@interfaces/helpers/implementation/HttpSuccess";
import { IHttpResponse } from "@interfaces/helpers/IHttpResponse";
import { HttpRequest } from "@interfaces/helpers/implementation/HttpRequest";
import { IController } from "../Interface/IController";

export class UpdateNotificationStatusController implements IController {
    constructor(
        private updateNotificationUseCase: IUpdateNotificationStatus,
        private httpErrors: IHttpErrors = new HttpErrors(),
        private httpSuccess: IHttpSuccess = new HttpSuccess(),
    ) {}
    async handle(httpRequest: HttpRequest): Promise<IHttpResponse> {
        let status: boolean = false;
        let id: string = "";
        if (
            httpRequest &&
            httpRequest.body &&
            typeof httpRequest.body === "object" &&
            "status" in httpRequest.body &&
            typeof httpRequest.body.status === "boolean"
        ) {
            status = httpRequest.body.status;
        }
        if (
            httpRequest &&
            httpRequest.params &&
            typeof httpRequest.params === "object" &&
            "id" in httpRequest.params &&
            typeof httpRequest.params.id === "string"
        ) {
            id = httpRequest.params.id;
        }
        try {
            const result = await this.updateNotificationUseCase.execute({
                id,
                status,
            });
            console.log(result);
            return this.httpSuccess.success_200(result);
        } catch (error) {
            if (error instanceof Error) {
                return this.httpErrors.error_400(error.message);
            }
            return this.httpErrors.error_500();
        }
    }
}
