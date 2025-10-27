import {
  FetchBlogsByLawyerQueryDto,
  FetchBlogsByLawyerResponseDto,
} from "@src/application/dtos/Blog/BlogDto";
import { IUseCase } from "../IUseCases/IUseCase";

export interface IFetchBlogsByLawyerUsecase
  extends IUseCase<FetchBlogsByLawyerQueryDto, FetchBlogsByLawyerResponseDto> {}
