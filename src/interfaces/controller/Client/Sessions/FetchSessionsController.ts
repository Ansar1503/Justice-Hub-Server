import { IController } from "../../Interface/IController";
import { IHttpErrors } from "@interfaces/helpers/IHttpErrors.";
import { IHttpSuccess } from "@interfaces/helpers/IHttpSuccess";
import { HttpErrors } from "@interfaces/helpers/implementation/HttpErrors";
import { HttpSuccess } from "@interfaces/helpers/implementation/HttpSuccess";
import { IHttpResponse } from "@interfaces/helpers/IHttpResponse";
import { HttpRequest } from "@interfaces/helpers/implementation/HttpRequest";
import { HttpResponse } from "@interfaces/helpers/implementation/HttpResponse";
import { IFetchSessionsUseCase } from "@src/application/usecases/Client/IFetchSessionsUseCase";

export class FetchSessionController implements IController {
    constructor(
    private fetchSessions: IFetchSessionsUseCase,
    private httpErrors: IHttpErrors = new HttpErrors(),
    private httpSuccess: IHttpSuccess = new HttpSuccess()
    ) {}
    async handle(httpRequest: HttpRequest): Promise<IHttpResponse> {
        const req = httpRequest as Record<string, any>;
        const user_id = req.user?.id;
        const { search, status, sort, order, consultation_type, page, limit } =
      req.query;
        try {
            const result = await this.fetchSessions.execute({
                user_id,
                search: typeof search === "string" ? search : "",
                status:
          typeof status === "string" &&
          ["completed", "cancelled", "upcoming", "ongoing", "missed"].includes(
              status
          )
              ? (status as
                | "completed"
                | "cancelled"
                | "upcoming"
                | "ongoing"
                | "missed")
              : undefined,
                sort:
          typeof sort === "string" &&
          ["name", "date", "amount", "created_at"].includes(sort)
              ? (sort as "name" | "date" | "amount" | "created_at")
              : "name",
                order:
          typeof order === "string" && (order === "asc" || order === "desc")
              ? (order as "asc" | "desc")
              : "asc",
                consultation_type:
          typeof consultation_type === "string" &&
          (consultation_type === "consultation" ||
            consultation_type === "follow-up")
              ? (consultation_type as "consultation" | "follow-up")
              : undefined,
                page: page ? Number(page) : 1,
                limit: limit ? Number(limit) : 10,
            });
            const success = this.httpSuccess.success_200(result);
            return new HttpResponse(success.statusCode, success.body);
        } catch (error) {
            const err = this.httpErrors.error_500();
            return new HttpResponse(err.statusCode, err.body);
        }
    }
}
