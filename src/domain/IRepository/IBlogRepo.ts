import { Blog } from "@domain/entities/BlogEntity";
import { IBaseRepository } from "./IBaseRepo";
import {
  FetchBlogsByLawyerQueryDto,
  FetchBlogsByLawyerResponseDto,
  UpdateBlogDto,
} from "@src/application/dtos/Blog/BlogDto";

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
  update(blogId: string, update: UpdateBlogDto): Promise<Blog | null>;
  findById(blogId: string): Promise<Blog | null>;
  findByLawyerAndTitle(title: string, lawyerId: string): Promise<Blog | null>;
  findByLawyer(
    payload: FetchBlogsByLawyerQueryDto
  ): Promise<FetchBlogsByLawyerResponseDto>;
}
