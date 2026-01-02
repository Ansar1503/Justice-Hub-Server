import { IController } from "@interfaces/controller/Interface/IController";
import { IHttpErrors } from "@interfaces/helpers/IHttpErrors.";
import { IHttpResponse } from "@interfaces/helpers/IHttpResponse";
import { IHttpSuccess } from "@interfaces/helpers/IHttpSuccess";
import { HttpErrors } from "@interfaces/helpers/implementation/HttpErrors";
import { HttpRequest } from "@interfaces/helpers/implementation/HttpRequest";
import { HttpResponse } from "@interfaces/helpers/implementation/HttpResponse";
import { HttpSuccess } from "@interfaces/helpers/implementation/HttpSuccess";
import { IFetchSessionsUseCase } from "@src/application/usecases/Client/IFetchSessionsUseCase";

export class FetchSessionsController implements IController {
  constructor(
    private fetchSession: IFetchSessionsUseCase,
    private httpSuccess: IHttpSuccess = new HttpSuccess(),
    private httpErrors: IHttpErrors = new HttpErrors()
  ) {}
  async handle(httpRequest: HttpRequest): Promise<IHttpResponse> {
    let user_id: string = "";
    let search: string = "";
    let status: "completed" | "cancelled" | "upcoming" | "ongoing" | "missed" =
      "upcoming";
    let sort: "name" | "date" | "amount" | "created_at" = "date";
    let order: "asc" | "desc" = "asc";
    let consultation_type: "consultation" | "follow-up" = "consultation";
    let page: number = 1;
    let limit: number = 10;
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
    if (httpRequest.query && typeof httpRequest.query === "object") {
      if ("search" in httpRequest.query) {
        search = String(httpRequest.query.search);
      }
      if (
        "status" in httpRequest.query &&
        (httpRequest.query.status === "completed" ||
          httpRequest.query.status === "cancelled" ||
          httpRequest.query.status === "upcoming" ||
          httpRequest.query.status === "ongoing" ||
          httpRequest.query.status === "missed")
      ) {
        status = httpRequest.query.status;
      }
      if (
        "sort" in httpRequest.query &&
        (httpRequest.query.sort === "name" ||
          httpRequest.query.sort === "date" ||
          httpRequest.query.sort === "amount" ||
          httpRequest.query.sort === "created_at")
      ) {
        sort = httpRequest.query.sort;
      }
      if (
        "order" in httpRequest.query &&
        (httpRequest.query.order === "asc" ||
          httpRequest.query.order === "desc")
      ) {
        order = httpRequest.query.order;
      }
      if (
        "consultation_type" in httpRequest.query &&
        (httpRequest.query.consultation_type === "consultation" ||
          httpRequest.query.consultation_type === "follow-up")
      ) {
        consultation_type = httpRequest.query.consultation_type;
      }
      if ("page" in httpRequest.query) {
        page = isNaN(Number(httpRequest.query.page))
          ? Number(httpRequest.query.page)
          : 1;
      }
      if ("limit" in httpRequest.query) {
        limit = isNaN(Number(httpRequest.query.limit))
          ? Number(httpRequest.query.limit)
          : 10;
      }
    }
    try {
      const result = await this.fetchSession.execute({
        limit,
        order,
        page,
        search,
        sort,
        user_id,
        consultation_type,
        status,
      });
      return this.httpSuccess.success_200({
        success: true,
        message: "success",
        data: result.data,
        currentPage: result.currentPage,
        totalPage: result.totalPage,
        totalCount: result.totalCount,
      });
    } catch (error) {
      if (
        error &&
        typeof error === "object" &&
        "code" in error &&
        "message" in error
      ) {
        const statusCode =
          typeof error?.code === "number" &&
          error.code >= 100 &&
          error.code < 600
            ? error.code
            : 500;
        return new HttpResponse(statusCode, { message: error.message });
      }
      return this.httpErrors.error_500();
    }
  }
}
