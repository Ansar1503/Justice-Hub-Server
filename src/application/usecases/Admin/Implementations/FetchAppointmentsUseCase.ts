import {
  FetchAppointmentsInputDto,
  FetchAppointmentsOutputDto,
} from "@src/application/dtos/Admin/FetchAppointmentsDto";
import { IFetchAppointmentsUseCase } from "../IFetchAppointmentsUseCase";
import { IAppointmentsRepository } from "@domain/IRepository/IAppointmentsRepo";

export class FetchAppointmentsUseCase implements IFetchAppointmentsUseCase {
  constructor(private AppointmentRepo: IAppointmentsRepository) {}

  async execute(
    input: FetchAppointmentsInputDto
  ): Promise<FetchAppointmentsOutputDto> {
    const appointments = await this.AppointmentRepo.findAllAggregate(input);
    return appointments;
  }
}
