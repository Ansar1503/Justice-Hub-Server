import {
  FetchBlogsByClientType,
  infiniteFetchBlogsByClient,
} from "@src/application/dtos/Blog/BlogDto";
import { IFetchBlogsByClientUsecase } from "../IFetchBlogsByClientUsecase";
import { IBlogRepo } from "@domain/IRepository/IBlogRepo";

export class FetchBlogsByClientUsecase implements IFetchBlogsByClientUsecase {
  constructor(private _blogsRepo: IBlogRepo) {}
  async execute(
    input: FetchBlogsByClientType
  ): Promise<infiniteFetchBlogsByClient> {
    const data = await this._blogsRepo.aggregateAll(input);
    return data;
  }
}
