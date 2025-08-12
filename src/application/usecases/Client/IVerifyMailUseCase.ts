import { IUseCase } from "../IUseCases/IUseCase";

export interface IVerifyMailUseCase extends IUseCase<{email: string, user_id: string},void>{}