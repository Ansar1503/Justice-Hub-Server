"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateBlogUsecase = void 0;
const BlogEntity_1 = require("@domain/entities/BlogEntity");
class CreateBlogUsecase {
    _blogRepo;
    constructor(_blogRepo) {
        this._blogRepo = _blogRepo;
    }
    async execute(input) {
        const duplicate = await this._blogRepo.findByLawyerAndTitle(input.title, input.lawyerId);
        if (duplicate) {
            throw new Error("A blog with this title already exists for this lawyer.");
        }
        const blog = BlogEntity_1.Blog.create({
            lawyerId: input.lawyerId,
            title: input.title,
            content: input.content,
            coverImage: input.coverImage,
            isPublished: input.isPublished,
        });
        const createdBlog = await this._blogRepo.create(blog);
        const response = {
            id: createdBlog.id,
            lawyerId: createdBlog.lawyerId,
            title: createdBlog.title,
            content: createdBlog.content,
            coverImage: createdBlog.coverImage,
            isPublished: createdBlog.isPublished,
            likes: createdBlog.likes,
            comments: createdBlog.comments,
            createdAt: createdBlog.createdAt,
            updatedAt: createdBlog.updatedAt,
        };
        return response;
    }
}
exports.CreateBlogUsecase = CreateBlogUsecase;
