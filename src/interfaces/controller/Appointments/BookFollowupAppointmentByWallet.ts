import { IHttpErrors } from "@interfaces/helpers/IHttpErrors.";
import { IHttpSuccess } from "@interfaces/helpers/IHttpSuccess";
import { IController } from "../Interface/IController";
import { HttpRequest } from "@interfaces/helpers/implementation/HttpRequest";
import { IHttpResponse } from "@interfaces/helpers/IHttpResponse";
import { BookFollowupAppointmentByWalletZodSchema } from "@interfaces/middelwares/validator/zod/Appointments/BookAppointmentByWalletSchema";
import { IBookFollowupAppointmentByWalletUsecase } from "@src/application/usecases/Appointments/IBookFollowupAppointmentByWalletUsecase";

export class BookFollowupAppointmentByWalletController implements IController {
  constructor(
    private _usecase: IBookFollowupAppointmentByWalletUsecase,
    private _errors: IHttpErrors,
    private _success: IHttpSuccess
  ) {}

  async handle(httpRequest: HttpRequest): Promise<IHttpResponse> {
    let userId = "";

    if (
      httpRequest.user &&
      typeof httpRequest.user === "object" &&
      "id" in httpRequest.user
    ) {
      userId = String(httpRequest.user.id);
    }

    if (!userId) {
      return this._errors.error_400("No userId found");
    }

    const parsed = BookFollowupAppointmentByWalletZodSchema.safeParse(
      httpRequest.body
    );

    if (!parsed.success) {
      return this._errors.error_400(parsed.error.errors[0].message);
    }

    try {
      const result = await this._usecase.execute({
        ...parsed.data,
        client_id: userId,
      });

      return this._success.success_200(result);
    } catch (error) {
      if (error instanceof Error) {
        return this._errors.error_400(error.message);
      }
      return this._errors.error_500();
    }
  }
}
