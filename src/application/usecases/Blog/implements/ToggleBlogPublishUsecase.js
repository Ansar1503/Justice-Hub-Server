"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ToggleBlogPublishUsecase = void 0;
class ToggleBlogPublishUsecase {
    _blogRepo;
    constructor(_blogRepo) {
        this._blogRepo = _blogRepo;
    }
    async execute(input) {
        const exists = await this._blogRepo.findById(input);
        if (!exists)
            throw new Error("No blog found");
        const toggle = exists.isPublished ? false : true;
        const updated = await this._blogRepo.togglePublishStatus(input, toggle);
        if (!updated)
            throw new Error("toggle blog status failed");
        return {
            comments: updated.comments,
            content: updated.content,
            createdAt: updated.createdAt,
            id: updated.id,
            isPublished: updated.isPublished,
            lawyerId: updated.lawyerId,
            likes: updated.likes,
            title: updated.title,
            updatedAt: updated.updatedAt,
            coverImage: updated.coverImage,
        };
    }
}
exports.ToggleBlogPublishUsecase = ToggleBlogPublishUsecase;
