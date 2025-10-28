import { BaseBlogDto } from "@src/application/dtos/Blog/BlogDto";
import { IUseCase } from "../IUseCases/IUseCase";

export interface IDeleteBlogUsecase extends IUseCase<string, BaseBlogDto> {}
