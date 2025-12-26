import { IHttpResponse } from "@interfaces/helpers/IHttpResponse";
import { HttpRequest } from "@interfaces/helpers/implementation/HttpRequest";
import { IHttpErrors } from "@interfaces/helpers/IHttpErrors.";
import { HttpErrors } from "@interfaces/helpers/implementation/HttpErrors";
import { IHttpSuccess } from "@interfaces/helpers/IHttpSuccess";
import { HttpSuccess } from "@interfaces/helpers/implementation/HttpSuccess";
import { IFetchAppointmentsClientUseCase } from "@src/application/usecases/Client/IFetchAppointmentsUseCase";
import { zodAppointmentQuerySchema } from "@interfaces/middelwares/validator/zod/zod.validate";
import { IController } from "../../Interface/IController";

export class FetchAppointmentDataController implements IController {
    constructor(
        private _fetchAppointments: IFetchAppointmentsClientUseCase,
        private _httpErrors: IHttpErrors = new HttpErrors(),
        private _httpSuccess: IHttpSuccess = new HttpSuccess(),
    ) {}

    async handle(httpRequest: HttpRequest): Promise<IHttpResponse> {
        let user_id = "";
        if (
            httpRequest.user &&
            typeof httpRequest.user == "object" &&
            "id" in httpRequest.user &&
            typeof httpRequest.user.id == "string" &&
            "role" in httpRequest.user &&
            httpRequest.user.role != "admin"
        ) {
            user_id = httpRequest.user.id;
        }
        const parsedData = zodAppointmentQuerySchema.safeParse(httpRequest.query);
        if (!parsedData.success) {
            const err = parsedData.error.errors[0];
            return this._httpErrors.error_400(err.message);
        }
        try {
            const result = await this._fetchAppointments.execute({
                ...parsedData.data,
                user_id,
            });
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
