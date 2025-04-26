import { Client } from "../../../domain/entities/Client.entity";
import { User } from "../../../domain/entities/User.entity";

export interface IAdminUseCase {
  fetchUsersByRole(role: "lawyer" | "client"): Promise<Client[]>;
}
