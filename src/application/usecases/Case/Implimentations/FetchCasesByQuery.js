"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchAllCasesByQueryUsecase = void 0;
class FetchAllCasesByQueryUsecase {
    _casesRepository;
    constructor(_casesRepository) {
        this._casesRepository = _casesRepository;
    }
    async execute(input) {
        return await this._casesRepository.findByQuery(input);
    }
}
exports.FetchAllCasesByQueryUsecase = FetchAllCasesByQueryUsecase;
