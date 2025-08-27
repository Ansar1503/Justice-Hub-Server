import { WalletDto } from "@src/application/dtos/wallet/WalletDto";
import { IUseCase } from "../IUseCases/IUseCase";

export interface IFetchWalletByUser extends IUseCase<string, WalletDto> {}
