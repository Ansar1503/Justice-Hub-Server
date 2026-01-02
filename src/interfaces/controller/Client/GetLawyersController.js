"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetLawyersController = void 0;
const HttpErrors_1 = require("@interfaces/helpers/implementation/HttpErrors");
const HttpSuccess_1 = require("@interfaces/helpers/implementation/HttpSuccess");
const HttpResponse_1 = require("@interfaces/helpers/implementation/HttpResponse");
class GetLawyersController {
    getLawyerUsecase;
    httpErrors;
    httpSuccess;
    constructor(getLawyerUsecase, httpErrors = new HttpErrors_1.HttpErrors(), httpSuccess = new HttpSuccess_1.HttpSuccess()) {
        this.getLawyerUsecase = getLawyerUsecase;
        this.httpErrors = httpErrors;
        this.httpSuccess = httpSuccess;
    }
    async handle(httpRequest) {
        const req = httpRequest;
        const { search = "", practiceAreas, specialisation, experienceMin = 0, experienceMax = 25, feeMin = 0, feeMax = 10000, sortBy = "experience", page = 1, limit = 10, } = req.query;
        const filters = {
            search: String(search),
            practiceAreas: practiceAreas
                ? Array.isArray(practiceAreas)
                    ? practiceAreas.map(String)
                    : [String(practiceAreas)]
                : undefined,
            specialisation: specialisation
                ? Array.isArray(specialisation)
                    ? specialisation.map(String)
                    : [String(specialisation)]
                : undefined,
            experienceMin: Number(experienceMin),
            experienceMax: Number(experienceMax),
            feeMin: Number(feeMin),
            feeMax: Number(feeMax),
            sortBy: String(sortBy),
            page: Number(page),
            limit: Number(limit),
        };
        try {
            const lawyers = await this.getLawyerUsecase.execute(filters);
            const success = this.httpSuccess.success_200({
                success: true,
                message: "lawyers fetch success",
                data: lawyers,
            });
            return new HttpResponse_1.HttpResponse(success.statusCode, success.body);
        }
        catch (error) {
            const err = this.httpErrors.error_500();
            return new HttpResponse_1.HttpResponse(err.statusCode, err.body);
        }
    }
}
exports.GetLawyersController = GetLawyersController;
