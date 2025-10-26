import { IBlogRepo } from "@domain/IRepository/IBlogRepo";
import { ICreateBlogUsecase } from "../ICreateBlogUsecase";
import { CreateBlogDto, BaseBlogDto } from "@src/application/dtos/Blog/BlogDto";
import { Blog } from "@domain/entities/BlogEntity";

export class CreateBlogUsecase implements ICreateBlogUsecase {
  constructor(private _blogRepo: IBlogRepo) {}
  async execute(input: CreateBlogDto): Promise<BaseBlogDto> {
    const duplicate = await this._blogRepo.findByLawyerAndTitle(
      input.title,
      input.lawyerId
    );
    if (duplicate) {
      throw new Error("A blog with this title already exists for this lawyer.");
    }
    const blog = Blog.create({
      lawyerId: input.lawyerId,
      title: input.title,
      content: input.content,
      coverImage: input.coverImage,
      isPublished: input.isPublished,
    });
    const createdBlog = await this._blogRepo.create(blog);
    const response: BaseBlogDto = {
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
