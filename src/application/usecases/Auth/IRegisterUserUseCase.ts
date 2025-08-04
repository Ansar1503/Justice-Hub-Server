import { ResposeUserDto } from "@src/application/dtos/user.dto";
import { IUseCase } from "../I_usecases/IUseCase";
import { User } from "@domain/entities/User";

export interface IRegiserUserUseCase extends IUseCase<User, ResposeUserDto> {}
