import { ClientUpdateDto } from "@src/application/dtos/client.dto";
import { IUseCase } from "../IUseCases/IUseCase";

export interface IUpdatePasswordUseCase
  extends IUseCase<
    {
      currentPassword: string;
      user_id: string;
      password: string;
    },
    ClientUpdateDto
  > {}
