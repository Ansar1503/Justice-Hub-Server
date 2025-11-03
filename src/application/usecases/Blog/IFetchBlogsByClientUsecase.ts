import {
  FetchBlogsByClientType,
  infiniteFetchBlogsByClient,
} from "@src/application/dtos/Blog/BlogDto";
import { IUseCase } from "../IUseCases/IUseCase";

export interface IFetchBlogsByClientUsecase
  extends IUseCase<FetchBlogsByClientType, infiniteFetchBlogsByClient> {}
