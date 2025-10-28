import { BlogMapper } from "@infrastructure/Mapper/Implementations/BlogMapper";
import { BlogRepo } from "@infrastructure/database/repo/BlogRepo";
import { DeleteBlogController } from "@interfaces/controller/Blog/DeleteBlogController";
import { IController } from "@interfaces/controller/Interface/IController";
import { HttpErrors } from "@interfaces/helpers/implementation/HttpErrors";
import { HttpSuccess } from "@interfaces/helpers/implementation/HttpSuccess";
import { DeleteBlogUsecase } from "@src/application/usecases/Blog/implements/DeleteBlogUsecase";

export function DeleteBlogComposer(): IController {
  const usecase = new DeleteBlogUsecase(new BlogRepo(new BlogMapper()));
  return new DeleteBlogController(usecase, new HttpErrors(), new HttpSuccess());
}
