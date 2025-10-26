import { BlogMapper } from "@infrastructure/Mapper/Implementations/BlogMapper";
import { BlogRepo } from "@infrastructure/database/repo/BlogRepo";
import { CreateBlogController } from "@interfaces/controller/Blog/CreateBlogController";
import { IController } from "@interfaces/controller/Interface/IController";
import { HttpErrors } from "@interfaces/helpers/implementation/HttpErrors";
import { HttpSuccess } from "@interfaces/helpers/implementation/HttpSuccess";
import { CreateBlogUsecase } from "@src/application/usecases/Blog/implements/CreateBlogUsecase";

export function CreateBlogComposer(): IController {
  const usecase = new CreateBlogUsecase(new BlogRepo(new BlogMapper()));
  return new CreateBlogController(usecase, new HttpErrors(), new HttpSuccess());
}
