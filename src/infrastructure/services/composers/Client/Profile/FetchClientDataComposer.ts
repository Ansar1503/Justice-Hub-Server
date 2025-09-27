import { FetchClientDataController } from "@interfaces/controller/Client/profile/FetchClientController";
import { IController } from "@interfaces/controller/Interface/IController";
import { FetchClientDataUseCaseDto } from "@src/application/usecases/Client/implementations/FetchClientDataUseCase";
import { UserRepository } from "@infrastructure/database/repo/UserRepo";
import { ClientRepository } from "@infrastructure/database/repo/ClientRepo";
import { AddressRepository } from "@infrastructure/database/repo/AddressRepo";
import { LawyerVerificationRepo } from "@infrastructure/database/repo/LawyerVerificationRepo";
import { LawyerVerificationMapper } from "@infrastructure/Mapper/Implementations/LawyerVerificaitionMapper";

export function FetchClientDataComposer(): IController {
    const usecase = new FetchClientDataUseCaseDto(
        new UserRepository(),
        new ClientRepository(),
        new AddressRepository(),
        new LawyerVerificationRepo(new LawyerVerificationMapper()),
    );
    const controller = new FetchClientDataController(usecase);
    return controller;
}
