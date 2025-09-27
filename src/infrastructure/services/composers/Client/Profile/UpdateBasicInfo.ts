import { IController } from "@interfaces/controller/Interface/IController";
import { UpdateBasicInfoController } from "@interfaces/controller/Client/profile/UpdateBasicInfo";
import { UpdateClientDataUseCase } from "@src/application/usecases/Client/implementations/UpdateClientDataUseCase";
import { UserRepository } from "@infrastructure/database/repo/UserRepo";
import { ClientRepository } from "@infrastructure/database/repo/ClientRepo";
import { CloudinaryService } from "@src/application/services/cloudinary.service";

export function updateClientDataComposer(): IController {
    const usecase = new UpdateClientDataUseCase(
        new UserRepository(),
        new ClientRepository(),
        new CloudinaryService()
    );
    return new UpdateBasicInfoController(usecase);
}
