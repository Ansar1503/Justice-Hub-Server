import { IUseCase } from "../I_usecases/IUseCase";

export interface IVerifyMailUseCase extends IUseCase<{email: string, user_id: string},void>{}