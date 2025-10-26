import { IBlogModel } from "@infrastructure/database/model/BlogModel";
import { IMapper } from "../IMapper";
import { Blog } from "@domain/entities/BlogEntity";

export class BlogMapper implements IMapper<Blog, IBlogModel> {
  toDomain(persistence: IBlogModel): Blog {
    return Blog.fromPersistence({
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

  toDomainArray(persistence: IBlogModel[]): Blog[] {
    return persistence.map((p) => this.toDomain(p));
  }

  toPersistence(entity: Blog): Partial<IBlogModel> {
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
