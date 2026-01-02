"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchCasetypeUsecase = void 0;
class FetchCasetypeUsecase {
    casetypeRepo;
    constructor(casetypeRepo) {
        this.casetypeRepo = casetypeRepo;
    }
    async execute(input) {
        return await this.casetypeRepo.findAllByQuery(input);
    }
}
exports.FetchCasetypeUsecase = FetchCasetypeUsecase;
