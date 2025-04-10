import { Client } from "../../../domain/entities/Client.entity";
import { IClientRepository } from "../../../domain/repository/client.repo";
import ClientModel from "../model/client.model";

export class ClientRepository implements IClientRepository {
  async create(client: Client): Promise<Client> {
    return await new ClientModel(client).save();
  }
}
