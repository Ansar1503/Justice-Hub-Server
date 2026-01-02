"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchALLUsers = void 0;
const HttpErrors_1 = require("@interfaces/helpers/implementation/HttpErrors");
const HttpResponse_1 = require("@interfaces/helpers/implementation/HttpResponse");
const HttpSuccess_1 = require("@interfaces/helpers/implementation/HttpSuccess");
class FetchALLUsers {
    fetchUserUseCase;
    httpErrors;
    httpSuccess;
    constructor(fetchUserUseCase, httpErrors = new HttpErrors_1.HttpErrors(), httpSuccess = new HttpSuccess_1.HttpSuccess()) {
        this.fetchUserUseCase = fetchUserUseCase;
        this.httpErrors = httpErrors;
        this.httpSuccess = httpSuccess;
    }
    isValidRole(value) {
        return value === "lawyer" || value === "client";
    }
    isValidStatus(value) {
        return value === "all" || value === "verified" || value === "blocked";
    }
    async handle(httpRequest) {
        if (!httpRequest.query || typeof httpRequest.query !== "object") {
            const error = this.httpErrors.error_400();
            return new HttpResponse_1.HttpResponse(error.statusCode, {
                error: "Query is missing or invalid",
            });
        }
        const query = httpRequest.query;
        const { role, search, page, limit, sort, order, status } = query;
        if (!this.isValidRole(role)) {
            const error = this.httpErrors.error_400();
            return new HttpResponse_1.HttpResponse(error.statusCode, {
                error: role ? "Invalid role provided" : "Role is required",
            });
        }
        const input = {
            role,
            search,
            sort,
            order,
            status: this.isValidStatus(status) ? status : "all",
            page: page && !isNaN(+page) ? +page : undefined,
            limit: limit && !isNaN(+limit) ? +limit : undefined,
        };
        try {
            const result = await this.fetchUserUseCase.execute(input);
            const success = this.httpSuccess.success_200(result);
            return new HttpResponse_1.HttpResponse(success.statusCode, success.body);
        }
        catch (err) {
            const error = this.httpErrors.error_500();
            return new HttpResponse_1.HttpResponse(error.statusCode, {
                error: "Internal Server Error",
            });
        }
    }
}
exports.FetchALLUsers = FetchALLUsers;
