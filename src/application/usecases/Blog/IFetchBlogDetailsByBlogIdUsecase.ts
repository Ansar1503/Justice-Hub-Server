import { FetchedBlogByClient } from "@src/application/dtos/Blog/BlogDto";
import { IUseCase } from "../IUseCases/IUseCase";

export interface IFetchBlogDetailsByBlogIdUsecase
  extends IUseCase<string, FetchedBlogByClient> {}
