import { getSessionMetaData } from "@src/application/services/stripe.service";
import { IGetSessionMetadataUseCase } from "../IGetSessionMetadataUseCase";
import { IAppointmentsRepository } from "@domain/IRepository/IAppointmentsRepo";

export class GetSessionMetadataUseCase implements IGetSessionMetadataUseCase {
    constructor(private appointmentRepo: IAppointmentsRepository) {}
    async execute(input: string): Promise<any> {
        const metadata = await getSessionMetaData(input);
        const { client_id, date, duration, lawyer_id, time } = metadata;
        if (!client_id || !date || !duration || !lawyer_id || !time) {
            const error: any = new Error("metatdata not found");
            error.code = 404;
            throw error;
        }
        return await this.appointmentRepo.delete({
            client_id,
            date: new Date(date),
            duration: Number(duration),
            time,
            lawyer_id,
        });
    }
}
