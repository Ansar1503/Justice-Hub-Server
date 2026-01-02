"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchBlogsByClientUsecase = void 0;
class FetchBlogsByClientUsecase {
    _blogsRepo;
    constructor(_blogsRepo) {
        this._blogsRepo = _blogsRepo;
    }
    async execute(input) {
        const data = await this._blogsRepo.aggregateAll(input);
        return data;
    }
}
exports.FetchBlogsByClientUsecase = FetchBlogsByClientUsecase;
