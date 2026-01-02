"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogMapper = void 0;
const BlogEntity_1 = require("@domain/entities/BlogEntity");
class BlogMapper {
    toDomain(persistence) {
        return BlogEntity_1.Blog.fromPersistence({
            id: persistence._id,
            lawyerId: persistence.lawyerId,
            title: persistence.title,
            content: persistence.content,
            coverImage: persistence.coverImage,
            isPublished: persistence.isPublished,
            likes: persistence.likes ?? [],
            comments: persistence.comments ?? [],
            createdAt: persistence.createdAt,
            updatedAt: persistence.updatedAt,
        });
    }
    toDomainArray(persistence) {
        return persistence.map((p) => this.toDomain(p));
    }
    toPersistence(entity) {
        return {
            _id: entity.id,
            lawyerId: entity.lawyerId,
            title: entity.title,
            content: entity.content,
            coverImage: entity.coverImage,
            isPublished: entity.isPublished,
            likes: entity.likes,
            comments: entity.comments,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
        };
    }
}
exports.BlogMapper = BlogMapper;
