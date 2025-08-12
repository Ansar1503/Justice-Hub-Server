import { IUseCase } from "../IUseCases/IUseCase";

export interface IBlockUserUseCase
  extends IUseCase<
    { user_id: string; status: boolean },
    { status: boolean; role: "lawyer" | "client" }
  > {}
