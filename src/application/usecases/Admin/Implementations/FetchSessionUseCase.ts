import {
  FetchSessionsInputDto,
  FetchSessionsOutputtDto,
} from "@src/application/dtos/sessions/FetchSessionsDto";
import { IFetchSessionUseCase } from "../IFetchSessionUseCase";
import { ISessionsRepo } from "@domain/IRepository/ISessionsRepo";

export class FetchSessionUseCase implements IFetchSessionUseCase {
  constructor(private sessionRepo: ISessionsRepo) {}
  async execute(
    input: FetchSessionsInputDto
  ): Promise<FetchSessionsOutputtDto> {
    const sessions = await this.sessionRepo.findSessionsAggregate(input);
    return sessions;
  }
}
