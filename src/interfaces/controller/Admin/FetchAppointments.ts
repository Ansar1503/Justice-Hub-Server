import { IHttpResponse } from "@interfaces/helpers/IHttpResponse";
import { HttpRequest } from "@interfaces/helpers/implementation/HttpRequest";
import { IController } from "../Interface/IController";
import { zodAppointmentQuerySchema } from "@interfaces/middelwares/validator/zod/zod.validate";
import { HttpResponse } from "@interfaces/helpers/implementation/HttpResponse";
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
      const error = this.httpError.error_400();
      return new HttpResponse(error.statusCode, { message: "Invalid query" });
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
      return new HttpResponse(success.statusCode, success.body);
    } catch (error) {
      console.log("error in fetching apointment by lawyersL :", error);
      const err = this.httpError.error_500();
      return new HttpResponse(err.statusCode, err.body);
    }
  }
}
