import { Blog } from "@domain/entities/BlogEntity";
import { IBaseRepository } from "./IBaseRepo";

export interface IBlogRepo extends IBaseRepository<Blog> {
  addComment(
    blogId: string,
    userId: string,
    comment: string
  ): Promise<Blog | null>;
  toggleLike(
    blogId: string,
    userId: string,
    like: boolean
  ): Promise<Blog | null>;
  findById(blogId: string): Promise<Blog | null>;
  findByLawyerAndTitle(title: string, lawyerId: string): Promise<Blog | null>;
}
