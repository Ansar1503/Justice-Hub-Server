import { IHttpSuccess } from "@interfaces/helpers/IHttpSuccess";
import { HttpSuccess } from "@interfaces/helpers/implementation/HttpSuccess";
import { IHttpErrors } from "@interfaces/helpers/IHttpErrors.";
import { HttpErrors } from "@interfaces/helpers/implementation/HttpErrors";
import { IHttpResponse } from "@interfaces/helpers/IHttpResponse";
import { HttpRequest } from "@interfaces/helpers/implementation/HttpRequest";
import { IUpdateAvailableSlotsUseCase } from "@src/application/usecases/Lawyer/IUpdateAvailableSlotsUseCase";
import { UpdateAvailableSlotsBodyValidateSchema } from "@interfaces/middelwares/validator/zod/lawyer/UpdateAvailableSlotSchema";
import { IController } from "../../Interface/IController";

export class UpdateAvailableSlotsController implements IController {
    constructor(
        private updateAvailableSlots: IUpdateAvailableSlotsUseCase,
        private httpSuccess: IHttpSuccess = new HttpSuccess(),
        private httpErrors: IHttpErrors = new HttpErrors(),
    ) {}
    async handle(httpRequest: HttpRequest): Promise<IHttpResponse> {
        let user_id: string = "";

        if (httpRequest.user && typeof httpRequest.user === "object" && "id" in httpRequest.user) {
            user_id = String(httpRequest.user.id);
        }

        if (!user_id) {
            return this.httpErrors.error_400("User_id Not found");
        }

        try {
            const parsed = UpdateAvailableSlotsBodyValidateSchema.safeParse(httpRequest.body);
            if (!parsed.success) {
                const err = parsed.error.errors[0];
                return this.httpErrors.error_400(err.message);
            }
            const payload = { ...parsed.data, lawyer_id: user_id };
            const result = await this.updateAvailableSlots.execute(payload);
            return this.httpSuccess.success_200(result);
        } catch (error) {
            if (error instanceof Error) {
                console.log("error in updating avaliable slots:", error);
                return this.httpErrors.error_500(error.message);
            }
            return this.httpErrors.error_500();
        }
    }
}
