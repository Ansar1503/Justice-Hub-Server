import { BlogMapper } from "@infrastructure/Mapper/Implementations/BlogMapper";
import { BlogRepo } from "@infrastructure/database/repo/BlogRepo";
import { FetchBlogsByClientController } from "@interfaces/controller/Blog/FetchBlogsByClientController";
import { IController } from "@interfaces/controller/Interface/IController";
import { HttpErrors } from "@interfaces/helpers/implementation/HttpErrors";
import { HttpSuccess } from "@interfaces/helpers/implementation/HttpSuccess";
import { FetchBlogsByClientUsecase } from "@src/application/usecases/Blog/implements/FetchBlogsByClientUsecase";

export function FetchBlogsByClientComposer(): IController {
  const usecase = new FetchBlogsByClientUsecase(new BlogRepo(new BlogMapper()));
  return new FetchBlogsByClientController(
    usecase,
    new HttpErrors(),
    new HttpSuccess()
  );
}
