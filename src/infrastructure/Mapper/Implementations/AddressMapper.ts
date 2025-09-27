import { Address } from "@domain/entities/Address";
import { IMapper } from "../IMapper";
import { IAddresModel } from "@infrastructure/database/model/AddressModel";

export class AddressMapper implements IMapper<Address, IAddresModel> {
    toDomain(persistence: IAddresModel): Address {
        return Address.fromPersistence({
            city: persistence.city,
            createdAt: persistence.createdAt,
            id: persistence._id.toString(),
            locality: persistence.locality,
            pincode: persistence.pincode,
            state: persistence.state,
            updatedAt: persistence.updatedAt,
            user_id: persistence.user_id,
        });
    }
    toDomainArray(persistence: IAddresModel[]): Address[] {
        return persistence.map((p) => this.toDomain(p));
    }
    toPersistence(entity: Address): Partial<IAddresModel> {
        return {
            _id: entity.id,
            city: entity.city,
            locality: entity.locality,
            state: entity.state,
            pincode: entity.pincode,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
        };
    }
}
