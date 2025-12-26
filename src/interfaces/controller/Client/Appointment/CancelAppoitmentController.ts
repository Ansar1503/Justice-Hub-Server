import { IHttpResponse } from "@interfaces/helpers/IHttpResponse";
import { HttpRequest } from "@interfaces/helpers/implementation/HttpRequest";
import { IHttpErrors } from "@interfaces/helpers/IHttpErrors.";
import { HttpErrors } from "@interfaces/helpers/implementation/HttpErrors";
import { IHttpSuccess } from "@interfaces/helpers/IHttpSuccess";
import { HttpSuccess } from "@interfaces/helpers/implementation/HttpSuccess";
import { HttpResponse } from "@interfaces/helpers/implementation/HttpResponse";
import { ICancelAppointmentUseCase } from "@src/application/usecases/Client/ICancelAppointmentUseCase";
import { IController } from "../../Interface/IController";

export class CancelAppointmentController implements IController {
    constructor(
        private _cancelAppointment: ICancelAppointmentUseCase,
        private _httpErrors: IHttpErrors = new HttpErrors(),
        private _httpSuccess: IHttpSuccess = new HttpSuccess(),
    ) {}
    async handle(httpRequest: HttpRequest): Promise<IHttpResponse> {
        const req = httpRequest as Record<string, any>;
        const client_id = req.user?.id;
        if (!client_id) {
            return new HttpResponse(400, { message: "Client Id not found" });
        }
        const { id, status } = req.body;
        if (!id || !status) {
            return new HttpResponse(400, { message: "Credentials not found" });
        }
        try {
            const result = await this._cancelAppointment.execute({
                id,
                status,
            });
            const success = this._httpSuccess.success_200(result);
            return new HttpResponse(success.statusCode, success.body);
        } catch (error) {
            if (error instanceof Error) {
                return this._httpErrors.error_400(error.message);
            }
            return this._httpErrors.error_500();
        }
    }
}
