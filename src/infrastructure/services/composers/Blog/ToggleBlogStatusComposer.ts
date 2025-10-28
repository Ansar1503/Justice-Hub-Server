import { BlogMapper } from "@infrastructure/Mapper/Implementations/BlogMapper";
import { BlogRepo } from "@infrastructure/database/repo/BlogRepo";
import { ToggleBlogStatusController } from "@interfaces/controller/Blog/ToggleBlogStatusController";
import { IController } from "@interfaces/controller/Interface/IController";
import { HttpErrors } from "@interfaces/helpers/implementation/HttpErrors";
import { HttpSuccess } from "@interfaces/helpers/implementation/HttpSuccess";
import { ToggleBlogPublishUsecase } from "@src/application/usecases/Blog/implements/ToggleBlogPublishUsecase";

export function ToggleBlogPublishComposer(): IController {
  const usecase = new ToggleBlogPublishUsecase(new BlogRepo(new BlogMapper()));
  return new ToggleBlogStatusController(
    usecase,
    new HttpErrors(),
    new HttpSuccess()
  );
}
