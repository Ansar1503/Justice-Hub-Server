import { ResposeUserDto } from "@src/application/dtos/user.dto";
import { IUseCase } from "../IUseCases/IUseCase";

export interface IChangeMailUseCase extends IUseCase<{ email: string; user_id: string }, ResposeUserDto> {}
