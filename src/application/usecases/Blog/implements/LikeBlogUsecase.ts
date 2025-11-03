import { IBlogRepo } from "@domain/IRepository/IBlogRepo";
import { ILikeOrDislikeBlogUsecase } from "../ILikeblogusecase";

export class LikeOrDislikeBlogUsecase implements ILikeOrDislikeBlogUsecase {
  constructor(private _blogRepo: IBlogRepo) {}
  async execute(input: {
    blogId: string;
    userId: string;
  }): Promise<{ liked: true; userId: string; blogId: string }> {
    const exists = await this._blogRepo.findById(input.blogId);
    if (!exists) throw new Error("blog doesnot exists");
    let like: boolean;
    if (exists.likes.includes(input.userId)) {
      exists.unlike(input.userId);
      like = false;
    } else {
      exists.like(input.userId);
      like = true;
    }
    try {
      await this._blogRepo.toggleLike(input.blogId, input.userId, like);
    } catch (error) {
      throw new Error("database update failed");
    }
    return { liked: true, userId: input.userId, blogId: input.blogId };
  }
}
