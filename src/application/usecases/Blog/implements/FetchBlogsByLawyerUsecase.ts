import {
  FetchBlogsByLawyerQueryDto,
  FetchBlogsByLawyerResponseDto,
} from "@src/application/dtos/Blog/BlogDto";
import { IFetchBlogsByLawyerUsecase } from "../IFetchBlogsByLawyerUsecase";
import { IBlogRepo } from "@domain/IRepository/IBlogRepo";

export class FetchBlogsByLawyerUsecase implements IFetchBlogsByLawyerUsecase {
  constructor(private _blogsRepo: IBlogRepo) {}
  async execute(
    input: FetchBlogsByLawyerQueryDto
  ): Promise<FetchBlogsByLawyerResponseDto> {
    return await this._blogsRepo.findByLawyer(input);
  }
}
