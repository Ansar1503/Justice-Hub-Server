import {
    FetchAppointmentsInputDto,
    FetchAppointmentsOutputDto,
} from "@src/application/dtos/Appointments/FetchAppointmentsDto";
import { IAppointmentsRepository } from "@domain/IRepository/IAppointmentsRepo";
import { IFetchAppointmentsClientUseCase } from "../IFetchAppointmentsUseCase";

export class FetchAppointmentsClientUseCase implements IFetchAppointmentsClientUseCase {
    constructor(private appointmentRepo: IAppointmentsRepository) {}
    async execute(input: FetchAppointmentsInputDto): Promise<FetchAppointmentsOutputDto> {
        return await this.appointmentRepo.findAllAggregate(input);
    }
}
