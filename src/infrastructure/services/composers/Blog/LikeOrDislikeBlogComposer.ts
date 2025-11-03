import { BlogMapper } from "@infrastructure/Mapper/Implementations/BlogMapper";
import { BlogRepo } from "@infrastructure/database/repo/BlogRepo";
import { LikeOrDislikeBlogController } from "@interfaces/controller/Blog/LikeOrDislikeBlogController";
import { IController } from "@interfaces/controller/Interface/IController";
import { HttpErrors } from "@interfaces/helpers/implementation/HttpErrors";
import { HttpSuccess } from "@interfaces/helpers/implementation/HttpSuccess";
import { LikeOrDislikeBlogUsecase } from "@src/application/usecases/Blog/implements/LikeBlogUsecase";

export function LikeOrDislikeBlogComposer(): IController {
  const usecase = new LikeOrDislikeBlogUsecase(new BlogRepo(new BlogMapper()));
  return new LikeOrDislikeBlogController(
    usecase,
    new HttpErrors(),
    new HttpSuccess()
  );
}
