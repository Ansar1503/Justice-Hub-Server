import {
  ClientDto,
  ClientUpdateDto,
} from "../../../application/dtos/client.dto";
import { Client } from "../../../domain/entities/Client.entity";
import { IClientRepository } from "../../../domain/I_repository/I_client.repo";
import ClientModel from "../model/client.model";

export class ClientRepository implements IClientRepository {
  async create(client: Client): Promise<Client> {
    return await new ClientModel(client).save();
  }
  async findByUserId(user_id: string): Promise<Client | null> {
    return await ClientModel.findOne({ user_id });
  }
  async update(clientData: ClientUpdateDto): Promise<Client | null> {
    return await ClientModel.findOneAndUpdate(
      { user_id: clientData.user_id },
      {
        $set: {
          dob: clientData.dob || "",
          gender: clientData.gender || "",
          profile_image: clientData.profile_image || "",
          address: clientData.address || undefined,
        },
      }
    );
  }
  async findAll(): Promise<Client[]> {
    return await ClientModel.find({}).populate("address");
  }
}
