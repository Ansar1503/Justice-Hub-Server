import { Availability } from "@domain/entities/Availability";
import { IAvailabilityModel } from "@infrastructure/database/model/AvailabilityModel";
import { IMapper } from "../IMapper";

export class AvailableSlotsMapper implements IMapper<Availability, IAvailabilityModel> {
    toDomain(persistence: IAvailabilityModel): Availability {
        return Availability.fromPersistence({
            id: persistence._id,
            lawyer_id: persistence.lawyer_id,
            monday: persistence.monday,
            tuesday: persistence.tuesday,
            wednesday: persistence.wednesday,
            thursday: persistence.thursday,
            friday: persistence.friday,
            saturday: persistence.saturday,
            sunday: persistence.sunday,
            createdAt: persistence.createdAt,
            updatedAt: persistence.updatedAt,
        });
    }
    toDomainArray(persistence: IAvailabilityModel[]): Availability[] {
        return persistence.map((p) => this.toDomain(p));
    }
    toPersistence(entity: Availability): Partial<IAvailabilityModel> {
        return {
            _id: entity.id,
            lawyer_id: entity.lawyer_id,
            monday: entity.getDayAvailability("monday"),
            tuesday: entity.getDayAvailability("tuesday"),
            wednesday: entity.getDayAvailability("wednesday"),
            thursday: entity.getDayAvailability("thursday"),
            friday: entity.getDayAvailability("friday"),
            saturday: entity.getDayAvailability("saturday"),
            sunday: entity.getDayAvailability("sunday"),
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
        };
    }
}
