import { IHttpResponse } from "@interfaces/helpers/IHttpResponse";
import { HttpRequest } from "@interfaces/helpers/implementation/HttpRequest";
import { IController } from "../Interface/IController";
import { zodAppointmentQuerySchema } from "@interfaces/middelwares/validator/zod/zod.validate";
import { IFetchAppointmentsUseCase } from "@src/application/usecases/Admin/IFetchAppointmentsUseCase";
import { IHttpSuccess } from "@interfaces/helpers/IHttpSuccess";
import { HttpSuccess } from "@interfaces/helpers/implementation/HttpSuccess";
import { IHttpErrors } from "@interfaces/helpers/IHttpErrors.";
import { HttpErrors } from "@interfaces/helpers/implementation/HttpErrors";

export class FetchAppointments implements IController {
  constructor(
    private FetchAppointmentUseCase: IFetchAppointmentsUseCase,
    private httpSuccess: IHttpSuccess = new HttpSuccess(),
    private httpError: IHttpErrors = new HttpErrors()
  ) {}

  async handle(httpRequest: HttpRequest): Promise<IHttpResponse> {
    const parsedData = zodAppointmentQuerySchema.safeParse(httpRequest.query);
    if (!parsedData.success) {
      const error = parsedData.error.errors[0];
      return this.httpError.error_400(error.message);
    }
    try {
      if (!parsedData.data) {
        return this.httpError.error_400("Invalid Credentials");
      }
      const result = await this.FetchAppointmentUseCase.execute(
        parsedData.data
      );
      const success = this.httpSuccess.success_200({
        success: true,
        message: "success",
        data: result.data,
        currentPage: result.currentPage,
        totalPage: result.totalPage,
        totalCount: result.totalCount,
      });
      // console.log("success:", success);
      return success;
    } catch (error) {
      if (error instanceof Error) {
        return this.httpError.error_400(error.message);
      }
      return this.httpError.error_500();
    }
  }
}
