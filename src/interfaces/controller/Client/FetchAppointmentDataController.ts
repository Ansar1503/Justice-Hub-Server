import { I_clientUsecase } from "@src/application/usecases/I_usecases/I_clientusecase";
import { IController } from "../Interface/IController";
import { IHttpResponse } from "@interfaces/helpers/IHttpResponse";
import { HttpRequest } from "@interfaces/helpers/implementation/HttpRequest";
import { IHttpErrors } from "@interfaces/helpers/IHttpErrors.";
import { HttpErrors } from "@interfaces/helpers/implementation/HttpErrors";
import { IHttpSuccess } from "@interfaces/helpers/IHttpSuccess";
import { HttpSuccess } from "@interfaces/helpers/implementation/HttpSuccess";
import { HttpResponse } from "@interfaces/helpers/implementation/HttpResponse";

export class FetchAppointmentDataController implements IController {
  constructor(
    private clientUseCase: I_clientUsecase,
    private httpErrors: IHttpErrors = new HttpErrors(),
    private httpSuccess: IHttpSuccess = new HttpSuccess()
  ) {}

  async handle(httpRequest: HttpRequest): Promise<IHttpResponse> {
    const req = httpRequest as Record<string, any>;
    const { search, appointmentStatus, sortField, sortOrder, page, limit } =
      req.query;
    const appointmentType = req.query.appointmentType;
    // console.log("req.query", req.query);
    const normalizedAppointmentType =
      typeof appointmentType === "string" &&
      ["all", "consultation", "follow-up"].includes(appointmentType)
        ? (appointmentType as "all" | "consultation" | "follow-up")
        : "all";
    const client_id = req.user.id;
    type appointmentstatustype =
      | "all"
      | "confirmed"
      | "pending"
      | "completed"
      | "cancelled"
      | "rejected";
    const allowedStatuses: appointmentstatustype[] = [
      "all",
      "confirmed",
      "pending",
      "completed",
      "cancelled",
      "rejected",
    ];
    try {
      const result = await this.clientUseCase.fetchAppointmentDetails({
        appointmentStatus:
          typeof appointmentStatus === "string" &&
          allowedStatuses.includes(appointmentStatus as appointmentstatustype)
            ? (appointmentStatus as appointmentstatustype)
            : "all",
        appointmentType: normalizedAppointmentType,
        client_id,
        limit: Number(limit) || 5,
        page: Number(page) || 1,
        sortField:
          typeof sortField === "string" &&
          ["name", "consultation_fee", "date", "created_at"].includes(sortField)
            ? (sortField as "name" | "consultation_fee" | "date" | "created_at")
            : "date",
        sortOrder:
          typeof sortOrder === "string" &&
          (sortOrder === "asc" || sortOrder === "desc")
            ? sortOrder
            : "asc",
        search: String(search) || "",
      });
      const success = this.httpSuccess.success_200(result);
      return new HttpResponse(success.statusCode, success.body);
    } catch (error) {
      // console.log("error", error);
      const err = this.httpErrors.error_500();
      return new HttpResponse(err.statusCode, err.body);
    }
  }
}
