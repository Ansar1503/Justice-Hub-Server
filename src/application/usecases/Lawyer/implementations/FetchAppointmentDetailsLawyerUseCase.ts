import {
  FetchAppointmentInputDto,
  FetchAppointmentsOutputDto,
} from "@src/application/dtos/Lawyer/FetchAppointmentDto";
import { IFetchAppointmentDetailsLawyerUseCase } from "../IFetchAppointmentDetailsLawyerUseCase";
import { IAppointmentsRepository } from "@domain/IRepository/IAppointmentsRepo";

export class FetchAppointmentsLawyerUseCase
  implements IFetchAppointmentDetailsLawyerUseCase
{
  constructor(private appointRepo: IAppointmentsRepository) {}
  async execute(
    input: FetchAppointmentInputDto
  ): Promise<FetchAppointmentsOutputDto> {
    return await this.appointRepo.findForLawyersUsingAggregation(input);
  }
}
