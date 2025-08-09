import {
  FetchSessionsInputDto,
  FetchSessionsOutputtDto,
} from "@src/application/dtos/Lawyer/FetchSessionsDto";
import { IFetchSessionUseCase } from "../IFetchSessionsUseCase";
import { ISessionsRepo } from "@domain/IRepository/ISessionsRepo";

export class FetchSessionsUseCase implements IFetchSessionUseCase {
  constructor(private sessionsRepo: ISessionsRepo) {}
  async execute(
    input: FetchSessionsInputDto
  ): Promise<FetchSessionsOutputtDto> {
    return this.sessionsRepo.aggregate({
      ...input,
      role: "lawyer",
    });
  }
}
