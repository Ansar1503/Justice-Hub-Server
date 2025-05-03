import { Client } from "../../../domain/entities/Client.entity";
import { lawyer } from "../../../domain/entities/Lawyer.entity";
import { User } from "../../../domain/entities/User.entity";

export interface IAdminUseCase {
  fetchUsers(query:any): Promise<Client[]>;
  fetchLawyers(query:any): Promise<lawyer[] | []>;
  blockUser(query:any):Promise<User>;
  changeVerificationStatus(payload: {
    user_id: string;
    status: "verified" | "rejected" | "pending" | "requested";
  }):Promise<lawyer>
}
