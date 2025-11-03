import { IBlogRepo } from "@domain/IRepository/IBlogRepo";
import { IFetchBlogDetailsByBlogIdUsecase } from "../IFetchBlogDetailsByBlogIdUsecase";
import {
  FetchedBlogByClient,
  relatedBlogs,
} from "@src/application/dtos/Blog/BlogDto";

export class FetchBlogDetailsByBlogIdUsecase
  implements IFetchBlogDetailsByBlogIdUsecase
{
  constructor(private _blogRepo: IBlogRepo) {}
  async execute(input: string): Promise<FetchedBlogByClient & relatedBlogs> {
    const blog = await this._blogRepo.getBlogById(input);
    if (!blog) throw new Error("blog not found");
    const relatedBlogs = await this._blogRepo.getRelatedBlogs(input);
    return { ...blog, relatedBlogs };
  }
}
