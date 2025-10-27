import { BlogMapper } from "@infrastructure/Mapper/Implementations/BlogMapper";
import { BlogRepo } from "@infrastructure/database/repo/BlogRepo";
import { FetchBlogsByLawyerController } from "@interfaces/controller/Blog/FetchBlogsByLawyerController";
import { IController } from "@interfaces/controller/Interface/IController";
import { HttpErrors } from "@interfaces/helpers/implementation/HttpErrors";
import { HttpSuccess } from "@interfaces/helpers/implementation/HttpSuccess";
import { FetchBlogsByLawyerUsecase } from "@src/application/usecases/Blog/implements/FetchBlogsByLawyerUsecase";

export function FetchBlogsByLawyerComposer(): IController {
  const usecase = new FetchBlogsByLawyerUsecase(new BlogRepo(new BlogMapper()));
  return new FetchBlogsByLawyerController(
    usecase,
    new HttpErrors(),
    new HttpSuccess()
  );
}
