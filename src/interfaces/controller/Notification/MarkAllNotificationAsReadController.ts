import { IMarkAllNotificationAsRead } from "@src/application/usecases/Notification/IMarkAllNotificationAsRead";
import { IHttpSuccess } from "@interfaces/helpers/IHttpSuccess";
import { HttpSuccess } from "@interfaces/helpers/implementation/HttpSuccess";
import { HttpErrors } from "@interfaces/helpers/implementation/HttpErrors";
import { IHttpErrors } from "@interfaces/helpers/IHttpErrors.";
import { IHttpResponse } from "@interfaces/helpers/IHttpResponse";
import { HttpRequest } from "@interfaces/helpers/implementation/HttpRequest";
import { IController } from "../Interface/IController";

export class MarkAllNotificationAsReadController implements IController {
    constructor(
        private markAllNotificationAsReadUseCase: IMarkAllNotificationAsRead,
        private httpSuccess: IHttpSuccess = new HttpSuccess(),
        private httpError: IHttpErrors = new HttpErrors(),
    ) {}
    async handle(httpRequest: HttpRequest): Promise<IHttpResponse> {
        let user_id = "";
        if (
            httpRequest.user &&
            typeof httpRequest.user === "object" &&
            "id" in httpRequest.user &&
            typeof httpRequest.user.id === "string"
        ) {
            user_id = httpRequest.user.id;
        }
        try {
            const result = await this.markAllNotificationAsReadUseCase.execute(user_id);
            return this.httpSuccess.success_200(result);
        } catch (error) {
            if (error instanceof Error) {
                return this.httpError.error_400(error.message);
            }
            return this.httpError.error_500();
        }
    }
}
