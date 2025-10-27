import { BaseBlogDto, UpdateBlogDto } from "@src/application/dtos/Blog/BlogDto";
import { IUseCase } from "../IUseCases/IUseCase";

export interface IUpdateBlogUsecase
  extends IUseCase<UpdateBlogDto, BaseBlogDto> {}
