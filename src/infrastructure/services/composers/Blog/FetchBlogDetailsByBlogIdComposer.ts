import { BlogMapper } from "@infrastructure/Mapper/Implementations/BlogMapper";
import { BlogRepo } from "@infrastructure/database/repo/BlogRepo";
import { FetchBlogDetailsByBlogIdController } from "@interfaces/controller/Blog/FetchBlogDetailsByBlogIdController";
import { IController } from "@interfaces/controller/Interface/IController";
import { HttpErrors } from "@interfaces/helpers/implementation/HttpErrors";
import { HttpSuccess } from "@interfaces/helpers/implementation/HttpSuccess";
import { FetchBlogDetailsByBlogIdUsecase } from "@src/application/usecases/Blog/implements/FetchBlogDetailsByBlogIdUsecase";

export function FetchBlogDetailsByBlogIdComposer(): IController {
  const usecase = new FetchBlogDetailsByBlogIdUsecase(
    new BlogRepo(new BlogMapper())
  );
  return new FetchBlogDetailsByBlogIdController(
    usecase,
    new HttpErrors(),
    new HttpSuccess()
  );
}
