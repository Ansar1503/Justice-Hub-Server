import { ResposeUserDto } from "@src/application/dtos/user.dto";
import { IUseCase } from "../I_usecases/IUseCase";

export interface ILoginUserUseCase
  extends IUseCase<
    {
      email: string;
      password: string;
    },
    {
      user: ResposeUserDto;
      accesstoken: string;
      refreshtoken: string;
    }
  > {}
