import { Client } from "@domain/entities/Client";
import { IClientModel } from "@infrastructure/database/model/ClientModel";
import { IMapper } from "../IMapper";

export class ClientMapper implements IMapper<Client, IClientModel> {
    toDomain(persistence: IClientModel): Client {
        return Client.fromPersistance({
            id: persistence._id,
            user_id: persistence.user_id,
            profile_image: persistence.profile_image,
            gender: persistence.gender,
            dob: persistence.dob,
            address: persistence.address.toString(),
            createdAt: persistence.createdAt,
            updatedAt: persistence.updatedAt,
        });
    }
    toDomainArray(persistence: IClientModel[]): Client[] {
        return persistence.map((p) => this.toDomain(p));
    }
    toPersistence(entity: Client): Partial<IClientModel> {
        return {
            _id: entity.id,
            user_id: entity.user_id,
            profile_image: entity.profile_image,
            gender: entity.gender,
            dob: entity.dob,
            address: entity.address,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
        };
    }
}
