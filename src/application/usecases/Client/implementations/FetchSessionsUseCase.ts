import {
  FetchSessionsInputDto,
  FetchSessionOutputDto,
} from "@src/application/dtos/client/FetchSessionsDto";
import { IFetchSessionsUseCase } from "../IFetchSessionsUseCase";
import { ISessionsRepo } from "@domain/IRepository/ISessionsRepo";

export class FetchSessionsUseCase implements IFetchSessionsUseCase {
  constructor(private sessionRepo: ISessionsRepo) {}

  async execute(input: FetchSessionsInputDto): Promise<FetchSessionOutputDto> {
    return await this.sessionRepo.aggregate({ ...input, role: "client" });
  }
}
