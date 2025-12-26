import {
    FetchAppointmentsInputDto,
    FetchAppointmentsOutputDto,
} from "@src/application/dtos/Appointments/FetchAppointmentsDto";
import { IAppointmentsRepository } from "@domain/IRepository/IAppointmentsRepo";
import { IFetchAppointmentsClientUseCase } from "../IFetchAppointmentsUseCase";

export class FetchAppointmentsClientUseCase implements IFetchAppointmentsClientUseCase {
    constructor(private _appointmentRepo: IAppointmentsRepository) {}
    async execute(input: FetchAppointmentsInputDto): Promise<FetchAppointmentsOutputDto> {
        return await this._appointmentRepo.findAllAggregate(input);
    }
}
