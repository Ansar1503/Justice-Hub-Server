import { Client } from "../entities/Client.entity";

export interface IClientRepository {
  create(client: Client): Promise<Client>;
}