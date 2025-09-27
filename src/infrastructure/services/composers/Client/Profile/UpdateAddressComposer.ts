import { UpdateAddressController } from "@interfaces/controller/Client/profile/UpdateAddressController";
import { IController } from "@interfaces/controller/Interface/IController";
import { UpdateAddressUseCase } from "@src/application/usecases/Client/implementations/UpdateAddressUseCase";
import { UserRepository } from "@infrastructure/database/repo/UserRepo";
import { ClientRepository } from "@infrastructure/database/repo/ClientRepo";
import { AddressRepository } from "@infrastructure/database/repo/AddressRepo";

export function UpdateAddressComposer(): IController {
    const usecase = new UpdateAddressUseCase(new UserRepository(),new ClientRepository(),new AddressRepository());
    return new UpdateAddressController(usecase);
}
