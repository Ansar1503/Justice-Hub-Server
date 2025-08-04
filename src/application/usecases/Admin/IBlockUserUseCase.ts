import { IUseCase } from "../I_usecases/IUseCase";

export interface IBlockUserUseCase
  extends IUseCase<string, { status: boolean }> {}
