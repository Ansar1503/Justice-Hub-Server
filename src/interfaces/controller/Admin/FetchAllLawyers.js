"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchAllLawyers = void 0;
const HttpErrors_1 = require("@interfaces/helpers/implementation/HttpErrors");
const HttpSuccess_1 = require("@interfaces/helpers/implementation/HttpSuccess");
const HttpResponse_1 = require("@interfaces/helpers/implementation/HttpResponse");
class FetchAllLawyers {
    fetchAllLawyerUseCase;
    httpErrors;
    httpSuccess;
    constructor(fetchAllLawyerUseCase, httpErrors = new HttpErrors_1.HttpErrors(), httpSuccess = new HttpSuccess_1.HttpSuccess()) {
        this.fetchAllLawyerUseCase = fetchAllLawyerUseCase;
        this.httpErrors = httpErrors;
        this.httpSuccess = httpSuccess;
    }
    isValidSortField(value) {
        return value === "name" || value === "experience" || value === "consultation_fee" || value === "createdAt";
    }
    isValidSortOrder(value) {
        return value === "asc" || value === "desc";
    }
    isValidStatus(value) {
        return value === "verified" || value === "rejected" || value === "pending" || value === "requested";
    }
    async handle(httpRequest) {
        if (!httpRequest.query || typeof httpRequest.query !== "object") {
            const error = this.httpErrors.error_400();
            return new HttpResponse_1.HttpResponse(error.statusCode, {
                error: "Query is missing or invalid",
            });
        }
        const query = httpRequest.query;
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
exports.FetchAllLawyers = FetchAllLawyers;
