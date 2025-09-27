import { WalletRepo } from "@infrastructure/database/repo/WalletRepo";
import { IController } from "@interfaces/controller/Interface/IController";
import { FetchWalletByUserController } from "@interfaces/controller/wallet/FetchWalletByUser";
import { FetchWalletByUser } from "@src/application/usecases/Wallet/implementation/FetchWalletByUser";

export function FetchWalletByUserComposer(): IController {
    const usecase = new FetchWalletByUser(new WalletRepo());
    return new FetchWalletByUserController(usecase);
}
