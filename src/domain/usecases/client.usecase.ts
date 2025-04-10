import { User } from "../entities/User.entity";
import { Client } from "../entities/Client.entity";
import { ClientRepository } from "../../infrastructure/database/repo/client.repo";

export class ClientUseCase {
  private clientRepository: ClientRepository;
  constructor(clientRepository: ClientRepository) {
    this.clientRepository = clientRepository;
  }
  
}
