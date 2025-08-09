import { IMapper } from "@infrastructure/Mapper/IMapper";
import { ClientUpdateDto } from "../../../application/dtos/client.dto";
import { Client } from "../../../domain/entities/Client";
import { IClientRepository } from "../../../domain/IRepository/IClientRepo";
import ClientModel, { IClientModel } from "../model/ClientModel";
import { ClientMapper } from "@infrastructure/Mapper/Implementations/ClientMapper";

export class ClientRepository implements IClientRepository {
  constructor(
    private mapper: IMapper<Client, IClientModel> = new ClientMapper()
  ) {}

  async create(client: Client): Promise<Client> {
    const mapped = this.mapper.toPersistence(client);
    const data = await new ClientModel(mapped).save();
    return this.mapper.toDomain(data);
  }
  async findByUserId(user_id: string): Promise<Client | null> {
    return await ClientModel.findOne({ user_id });
  }
  async update(clientData: ClientUpdateDto): Promise<Client | null> {
    return await ClientModel.findOneAndUpdate(
      { user_id: clientData.user_id },
      {
        $set: {
          dob: clientData.dob,
          gender: clientData.gender,
          profile_image: clientData.profile_image,
          address: clientData.address,
        },
      }
    );
  }
  async findAll(): Promise<Client[] | []> {
    const data = await ClientModel.find({}).populate("address");
    return data && this.mapper.toDomainArray
      ? this.mapper.toDomainArray(data)
      : [];
  }
}
