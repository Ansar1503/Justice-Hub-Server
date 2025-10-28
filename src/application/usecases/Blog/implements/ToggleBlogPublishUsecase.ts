import { BaseBlogDto } from "@src/application/dtos/Blog/BlogDto";
import { IToggleBlogPublishUsecase } from "../IToggleBlogPublishUsecase";
import { IBlogRepo } from "@domain/IRepository/IBlogRepo";

export class ToggleBlogPublishUsecase implements IToggleBlogPublishUsecase {
  constructor(private _blogRepo: IBlogRepo) {}
  async execute(input: string): Promise<BaseBlogDto> {
    const exists = await this._blogRepo.findById(input);
    if (!exists) throw new Error("No blog found");
    const toggle = exists.isPublished ? false : true;
    const updated = await this._blogRepo.togglePublishStatus(input, toggle);
    if (!updated) throw new Error("toggle blog status failed");
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
