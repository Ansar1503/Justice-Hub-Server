import { IController } from "@interfaces/controller/Interface/IController";
import { IHttpErrors } from "@interfaces/helpers/IHttpErrors.";
import { IHttpResponse } from "@interfaces/helpers/IHttpResponse";
import { IHttpSuccess } from "@interfaces/helpers/IHttpSuccess";
import { HttpErrors } from "@interfaces/helpers/implementation/HttpErrors";
import { HttpRequest } from "@interfaces/helpers/implementation/HttpRequest";
import { HttpSuccess } from "@interfaces/helpers/implementation/HttpSuccess";
import { IRemoveOverrideSlotUseCase } from "@src/application/usecases/Lawyer/IRemoveOverrideSlotsUseCase";

export class RemoveOverrideSlotsController implements IController {
    constructor(
    private removeOverrideSlots: IRemoveOverrideSlotUseCase,
    private httpSuccess: IHttpSuccess = new HttpSuccess(),
    private httpErrors: IHttpErrors = new HttpErrors()
    ) {}
    async handle(httpRequest: HttpRequest): Promise<IHttpResponse> {
        let user_id: string = "";
        let date: string = "";
        if (
            httpRequest.user &&
      typeof httpRequest.user === "object" &&
      "id" in httpRequest.user
        ) {
            user_id = String(httpRequest.user.id);
        }
        if (!user_id) {
            return this.httpErrors.error_400("User_id Not found");
        }
        if (!httpRequest.params) {
            return this.httpErrors.error_400("Invalid Params");
        }
        if (typeof httpRequest.query === "object" && httpRequest.query !== null) {
            if ("date" in httpRequest.query) {
                date =
          typeof httpRequest.query.date === "string"
              ? httpRequest.query.date
              : String(httpRequest.query.date);
            }
        }

        try {
            const response = await this.removeOverrideSlots.execute({
                lawyer_id: user_id,
                date: date,
            });
            return this.httpSuccess.success_200({
                success: true,
                message: "override slots removed",
                data: response,
            });
        } catch (error) {
            console.log("error while deleting override data", error);
            if (error instanceof Error) {
                return this.httpErrors.error_400(error.message);
            }
            return this.httpErrors.error_500();
        }
    }
}
