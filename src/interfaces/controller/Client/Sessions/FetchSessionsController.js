"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchSessionController = void 0;
const HttpErrors_1 = require("@interfaces/helpers/implementation/HttpErrors");
const HttpSuccess_1 = require("@interfaces/helpers/implementation/HttpSuccess");
const HttpResponse_1 = require("@interfaces/helpers/implementation/HttpResponse");
class FetchSessionController {
    fetchSessions;
    httpErrors;
    httpSuccess;
    constructor(fetchSessions, httpErrors = new HttpErrors_1.HttpErrors(), httpSuccess = new HttpSuccess_1.HttpSuccess()) {
        this.fetchSessions = fetchSessions;
        this.httpErrors = httpErrors;
        this.httpSuccess = httpSuccess;
    }
    async handle(httpRequest) {
        const req = httpRequest;
        const user_id = req.user?.id;
        const { search, status, sort, order, consultation_type, page, limit } = req.query;
        try {
            const result = await this.fetchSessions.execute({
                user_id,
                search: typeof search === "string" ? search : "",
                status: typeof status === "string" &&
                    ["completed", "cancelled", "upcoming", "ongoing", "missed"].includes(status)
                    ? status
                    : undefined,
                sort: typeof sort === "string" && ["name", "date", "amount", "created_at"].includes(sort)
                    ? sort
                    : "name",
                order: typeof order === "string" && (order === "asc" || order === "desc")
                    ? order
                    : "asc",
                consultation_type: typeof consultation_type === "string" &&
                    (consultation_type === "consultation" || consultation_type === "follow-up")
                    ? consultation_type
                    : undefined,
                page: page ? Number(page) : 1,
                limit: limit ? Number(limit) : 10,
            });
            const success = this.httpSuccess.success_200(result);
            return new HttpResponse_1.HttpResponse(success.statusCode, success.body);
        }
        catch (error) {
            const err = this.httpErrors.error_500();
            return new HttpResponse_1.HttpResponse(err.statusCode, err.body);
        }
    }
}
exports.FetchSessionController = FetchSessionController;
