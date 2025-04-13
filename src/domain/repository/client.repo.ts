import { ClientDto, ClientUpdateDto } from "../../application/dtos/client.dto";
import { Client } from "../entities/Client.entity";

export interface IClientRepository {
  create(client: Client): Promise<Client>;
  findByUserId(user_id: string): Promise<Client | null>;
  update(client: ClientUpdateDto): Promise<Client | null>;
}
