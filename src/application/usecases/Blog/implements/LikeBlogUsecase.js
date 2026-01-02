"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LikeOrDislikeBlogUsecase = void 0;
class LikeOrDislikeBlogUsecase {
    _blogRepo;
    constructor(_blogRepo) {
        this._blogRepo = _blogRepo;
    }
    async execute(input) {
        const exists = await this._blogRepo.findById(input.blogId);
        if (!exists)
            throw new Error("blog doesnot exists");
        let like;
        if (exists.likes.includes(input.userId)) {
            exists.unlike(input.userId);
            like = false;
        }
        else {
            exists.like(input.userId);
            like = true;
        }
        try {
            await this._blogRepo.toggleLike(input.blogId, input.userId, like);
        }
        catch (error) {
            throw new Error("database update failed");
        }
        return { liked: true, userId: input.userId, blogId: input.blogId };
    }
}
exports.LikeOrDislikeBlogUsecase = LikeOrDislikeBlogUsecase;
