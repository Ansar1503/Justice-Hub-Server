"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FindAllPracticeAreasController = void 0;
const FindAllPracticeAreasQuery_1 = require("@interfaces/middelwares/validator/zod/PracticeAreas/FindAllPracticeAreasQuery");
class FindAllPracticeAreasController {
    _findAllPracticeAreas;
    _httpSucces;
    _httpErrors;
    constructor(_findAllPracticeAreas, _httpSucces, _httpErrors) {
        this._findAllPracticeAreas = _findAllPracticeAreas;
        this._httpSucces = _httpSucces;
        this._httpErrors = _httpErrors;
    }
    async handle(httpRequest) {
        const parsed = FindAllPracticeAreasQuery_1.FindAllPracticeAreasQuery.safeParse(httpRequest.query);
        if (!parsed.success) {
            const er = parsed.error.errors[0];
            return this._httpErrors.error_400(er.message);
        }
        try {
            const result = await this._findAllPracticeAreas.execute(parsed.data);
            return this._httpSucces.success_200(result);
        }
        catch (error) {
            if (error instanceof Error) {
                return this._httpErrors.error_400(error.message);
            }
            return this._httpErrors.error_500();
        }
    }
}
exports.FindAllPracticeAreasController = FindAllPracticeAreasController;
