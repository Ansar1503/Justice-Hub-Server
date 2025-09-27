import { Availability } from "@domain/entities/Availability";
import { IAvailableSlots } from "@domain/IRepository/IAvailableSlots";
import { IMapper } from "@infrastructure/Mapper/IMapper";
import { AvailableSlotsMapper } from "@infrastructure/Mapper/Implementations/AvailableSlotsMapper";
import AvailabilityModel, { IAvailabilityModel } from "../model/AvailabilityModel";

export class AvailableSlotRepository implements IAvailableSlots {
    constructor(private mapper: IMapper<Availability, IAvailabilityModel> = new AvailableSlotsMapper()) {}
    async findAvailableSlots(lawyer_id: string): Promise<Availability | null> {
        const data = await AvailabilityModel.findOne({ lawyer_id });
        return data ? this.mapper.toDomain(data) : null;
    }
    async updateAvailbleSlot(payload: Availability): Promise<Availability | null> {
        const newpayload = this.mapper.toPersistence(payload);
        const { _id, ...updateData } = newpayload;
        const data = await AvailabilityModel.findOneAndUpdate(
            {
                lawyer_id: payload.lawyer_id,
            },
            { $set: updateData },
            { upsert: true, new: true },
        );
        return data ? this.mapper.toDomain(data) : null;
    }
}
