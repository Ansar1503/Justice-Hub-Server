"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateBlogUsecase = void 0;
class UpdateBlogUsecase {
    _blogRepo;
    constructor(_blogRepo) {
        this._blogRepo = _blogRepo;
    }
    async execute(input) {
        const exists = await this._blogRepo.findById(input.blogId);
        if (!exists)
            throw new Error("no existing blog found");
        const data = await this._blogRepo.update(input.blogId, input);
        if (!data)
            throw new Error("blog update failed");
        return {
            comments: data.comments,
            content: data.content,
            createdAt: data.createdAt,
            id: data.id,
            isPublished: data.isPublished,
            lawyerId: data.lawyerId,
            likes: data.likes,
            title: data.title,
            updatedAt: data.updatedAt,
            coverImage: data.coverImage,
        };
    }
}
exports.UpdateBlogUsecase = UpdateBlogUsecase;
