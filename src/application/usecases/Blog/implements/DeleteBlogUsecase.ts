import { BaseBlogDto } from "@src/application/dtos/Blog/BlogDto";
import { IDeleteBlogUsecase } from "../IDeleteBlogUsecase";
import { IBlogRepo } from "@domain/IRepository/IBlogRepo";

export class DeleteBlogUsecase implements IDeleteBlogUsecase {
  constructor(private _blogRepo: IBlogRepo) {}
  async execute(input: string): Promise<BaseBlogDto> {
    const exist = await this._blogRepo.findById(input);
    if (!exist) throw new Error("blog doesnt exists");
    try {
      await this._blogRepo.delete(input);
    } catch (error) {
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
