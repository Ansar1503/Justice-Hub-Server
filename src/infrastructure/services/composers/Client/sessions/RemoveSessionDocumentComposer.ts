import { IController } from "@interfaces/controller/Interface/IController";
import { RemoveSessionDocumentController } from "@interfaces/controller/Client/Sessions/RemoveSessionDocument";
import { RemoveSessionDocumentsUseCase } from "@src/application/usecases/Client/implementations/RemoveSesisonDocumentsUseCase";
import { SessionDocumentsRepository } from "@infrastructure/database/repo/SessionsDocumentRepo";
import { CloudinaryService } from "@src/application/services/cloudinary.service";

export function RemoveSessionDocumentComposer(): IController {
    const usecase = new RemoveSessionDocumentsUseCase(
        new SessionDocumentsRepository(),
        new CloudinaryService()
    );
    return new RemoveSessionDocumentController(usecase);
}
