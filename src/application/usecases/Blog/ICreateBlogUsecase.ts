import { BaseBlogDto, CreateBlogDto } from "@src/application/dtos/Blog/BlogDto";
import { IUseCase } from "../IUseCases/IUseCase";

export interface ICreateBlogUsecase
  extends IUseCase<CreateBlogDto, BaseBlogDto> {}
