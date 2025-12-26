import { IHttpResponse } from "@interfaces/helpers/IHttpResponse";
import { HttpRequest } from "@interfaces/helpers/implementation/HttpRequest";
import { IHttpErrors } from "@interfaces/helpers/IHttpErrors.";
import { IHttpSuccess } from "@interfaces/helpers/IHttpSuccess";
import { HttpErrors } from "@interfaces/helpers/implementation/HttpErrors";
import { HttpResponse } from "@interfaces/helpers/implementation/HttpResponse";
import { HttpSuccess } from "@interfaces/helpers/implementation/HttpSuccess";
import { IFetchUsersUseCase } from "@src/application/usecases/Admin/IFetchUsersUseCase";
import { UseCaseInputDto } from "@src/application/dtos/Admin/FetchAllUsersDto";
import { IController } from "../Interface/IController";

export class FetchALLUsers implements IController {
    constructor(
        private _fetchUserUseCase: IFetchUsersUseCase,
        private _httpErrors: IHttpErrors = new HttpErrors(),
        private _httpSuccess: IHttpSuccess = new HttpSuccess(),
    ) {}

    private isValidRole(value: unknown): value is UseCaseInputDto["role"] {
        return value === "lawyer" || value === "client";
    }

    private isValidStatus(value: unknown): value is UseCaseInputDto["status"] {
        return value === "all" || value === "verified" || value === "blocked";
    }

    async handle(httpRequest: HttpRequest): Promise<IHttpResponse> {
        if (!httpRequest.query || typeof httpRequest.query !== "object") {
            const error = this._httpErrors.error_400();
            return new HttpResponse(error.statusCode, {
                error: "Query is missing or invalid",
            });
        }
        const query = httpRequest.query as Record<string, string>;

        const { role, search, page, limit, sort, order, status } = query;

        if (!this.isValidRole(role)) {
            const error = this._httpErrors.error_400();
            return new HttpResponse(error.statusCode, {
                error: role ? "Invalid role provided" : "Role is required",
            });
        }
        const input: UseCaseInputDto = {
            role,
            search,
            sort,
            order,
            status: this.isValidStatus(status) ? status : "all",
            page: page && !isNaN(+page) ? +page : undefined,
            limit: limit && !isNaN(+limit) ? +limit : undefined,
        };

        try {
            const result = await this._fetchUserUseCase.execute(input);
            const success = this._httpSuccess.success_200(result);
            return new HttpResponse(success.statusCode, success.body);
        } catch (err) {
            const error = this._httpErrors.error_500();
            return new HttpResponse(error.statusCode, {
                error: "Internal Server Error",
            });
        }
    }
}
