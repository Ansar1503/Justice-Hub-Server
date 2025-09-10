import { IFetchLawyerUseCase } from "@src/application/usecases/Admin/IFetchLawyersUseCase";
import { IController } from "../Interface/IController";
import { IHttpErrors } from "@interfaces/helpers/IHttpErrors.";
import { IHttpSuccess } from "@interfaces/helpers/IHttpSuccess";
import { HttpErrors } from "@interfaces/helpers/implementation/HttpErrors";
import { HttpSuccess } from "@interfaces/helpers/implementation/HttpSuccess";
import { IHttpResponse } from "@interfaces/helpers/IHttpResponse";
import { HttpRequest } from "@interfaces/helpers/implementation/HttpRequest";
import { HttpResponse } from "@interfaces/helpers/implementation/HttpResponse";

export class FetchAllLawyers implements IController {
  constructor(
    private fetchAllLawyerUseCase: IFetchLawyerUseCase,
    private httpErrors: IHttpErrors = new HttpErrors(),
    private httpSuccess: IHttpSuccess = new HttpSuccess()
  ) {}

  private isValidSortField(
    value: unknown
  ): value is "name" | "experience" | "consultation_fee" | "createdAt" {
    return (
      value === "name" ||
      value === "experience" ||
      value === "consultation_fee" ||
      value === "createdAt"
    );
  }

  private isValidSortOrder(value: unknown): value is "asc" | "desc" {
    return value === "asc" || value === "desc";
  }

  private isValidStatus(
    value: unknown
  ): value is "verified" | "rejected" | "pending" | "requested" {
    return (
      value === "verified" ||
      value === "rejected" ||
      value === "pending" ||
      value === "requested"
    );
  }

  async handle(httpRequest: HttpRequest): Promise<IHttpResponse> {
    if (!httpRequest.query || typeof httpRequest.query !== "object") {
      const error = this.httpErrors.error_400();
      return new HttpResponse(error.statusCode, {
        error: "Query is missing or invalid",
      });
    }

    const query = httpRequest.query as Record<string, string>;

    const { limit, page, sort, order, search, status } = query;

    const sortField = this.isValidSortField(sort) ? sort : "name";
    const sortOrder = this.isValidSortOrder(order) ? order : "asc";
    const lawyerStatus = this.isValidStatus(status) ? status : undefined;

    const input = {
      limit: limit && !isNaN(+limit) ? +limit : 10,
      page: page && !isNaN(+page) ? +page : 1,
      sort: sortField,
      sortBy: sortOrder,
      search: typeof search === "string" ? search : undefined,
      status: lawyerStatus,
    };

    try {
      const result = await this.fetchAllLawyerUseCase.execute(input);

      const success = this.httpSuccess.success_200(result);
      return new HttpResponse(success.statusCode, success.body);
    } catch (err) {
      const error = this.httpErrors.error_500();
      return new HttpResponse(error.statusCode, {
        error: "Internal Server Error",
      });
    }
  }
}
