import { IUseCase } from "../IUseCases/IUseCase";

export interface ILikeOrDislikeBlogUsecase
  extends IUseCase<
    { blogId: string; userId: string },
    { liked: true; userId: string; blogId: string }
  > {}
