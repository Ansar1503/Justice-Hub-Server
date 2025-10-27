import { UpdateBlogDto, BaseBlogDto } from "@src/application/dtos/Blog/BlogDto";
import { IUpdateBlogUsecase } from "../IUpdateBlogUsecase";
import { IBlogRepo } from "@domain/IRepository/IBlogRepo";

export class UpdateBlogUsecase implements IUpdateBlogUsecase {
  constructor(private _blogRepo: IBlogRepo) {}
  async execute(input: UpdateBlogDto): Promise<BaseBlogDto> {
    const exists = await this._blogRepo.findById(input.blogId);
    if (!exists) throw new Error("no existing blog found");
    const data = await this._blogRepo.update(input.blogId, input);
    if (!data) throw new Error("blog update failed");
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
