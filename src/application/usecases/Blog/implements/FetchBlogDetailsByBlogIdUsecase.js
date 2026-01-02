"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchBlogDetailsByBlogIdUsecase = void 0;
class FetchBlogDetailsByBlogIdUsecase {
    _blogRepo;
    constructor(_blogRepo) {
        this._blogRepo = _blogRepo;
    }
    async execute(input) {
        const blog = await this._blogRepo.getBlogById(input);
        if (!blog)
            throw new Error("blog not found");
        const relatedBlogs = await this._blogRepo.getRelatedBlogs(input);
        return { ...blog, relatedBlogs };
    }
}
exports.FetchBlogDetailsByBlogIdUsecase = FetchBlogDetailsByBlogIdUsecase;
