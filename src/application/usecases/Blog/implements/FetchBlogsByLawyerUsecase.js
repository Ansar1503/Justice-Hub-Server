"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchBlogsByLawyerUsecase = void 0;
class FetchBlogsByLawyerUsecase {
    _blogsRepo;
    constructor(_blogsRepo) {
        this._blogsRepo = _blogsRepo;
    }
    async execute(input) {
        return await this._blogsRepo.findByLawyer(input);
    }
}
exports.FetchBlogsByLawyerUsecase = FetchBlogsByLawyerUsecase;
