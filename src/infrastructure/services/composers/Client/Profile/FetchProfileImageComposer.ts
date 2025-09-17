import { ClientRepository } from "@infrastructure/database/repo/ClientRepo";
import { FetchProfileImageController } from "@interfaces/controller/Client/profile/FetchProfileImage";
import { IController } from "@interfaces/controller/Interface/IController";
import { HttpErrors } from "@interfaces/helpers/implementation/HttpErrors";
import { HttpSuccess } from "@interfaces/helpers/implementation/HttpSuccess";
import { CloudinaryService } from "@src/application/services/cloudinary.service";
import { FetchProfileImageUsecase } from "@src/application/usecases/Client/implementations/FetchProfileImageUsecase";

export function FetchProfileImageComposer(): IController {
  const usecase = new FetchProfileImageUsecase(
    new ClientRepository(),
    new CloudinaryService()
  );
  return new FetchProfileImageController(
    usecase,
    new HttpErrors(),
    new HttpSuccess()
  );
}
