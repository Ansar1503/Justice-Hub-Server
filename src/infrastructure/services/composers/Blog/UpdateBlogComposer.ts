import { BlogMapper } from "@infrastructure/Mapper/Implementations/BlogMapper";
import { BlogRepo } from "@infrastructure/database/repo/BlogRepo";
import { UpdateBlogController } from "@interfaces/controller/Blog/UpdateBlogController";
import { IController } from "@interfaces/controller/Interface/IController";
import { HttpErrors } from "@interfaces/helpers/implementation/HttpErrors";
import { HttpSuccess } from "@interfaces/helpers/implementation/HttpSuccess";
import { UpdateBlogUsecase } from "@src/application/usecases/Blog/implements/UpdateBlogUsecase";

export function UpdateBlogComposer(): IController {
  const usecase = new UpdateBlogUsecase(new BlogRepo(new BlogMapper()));
  return new UpdateBlogController(usecase, new HttpErrors(), new HttpSuccess());
}
