"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteBlogUsecase = void 0;
class DeleteBlogUsecase {
    _blogRepo;
    constructor(_blogRepo) {
        this._blogRepo = _blogRepo;
    }
    async execute(input) {
        const exist = await this._blogRepo.findById(input);
        if (!exist)
            throw new Error("blog doesnt exists");
        try {
            await this._blogRepo.delete(input);
        }
        catch (error) {
            throw new Error("blog delete error");
        }
        return {
            comments: exist.comments,
            content: exist.content,
            createdAt: exist.createdAt,
            id: exist.id,
            isPublished: exist.isPublished,
            lawyerId: exist.lawyerId,
            likes: exist.likes,
            title: exist.title,
            updatedAt: exist.updatedAt,
            coverImage: exist.coverImage,
        };
    }
}
exports.DeleteBlogUsecase = DeleteBlogUsecase;
