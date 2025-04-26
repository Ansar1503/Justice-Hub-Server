import { use } from "passport";
import { Client } from "../../domain/entities/Client.entity";
import { User } from "../../domain/entities/User.entity";
import { IAddressRepository } from "../../domain/I_repository/I_address.repo";
import { IClientRepository } from "../../domain/I_repository/I_client.repo";
import { IUserRepository } from "../../domain/I_repository/I_user.repo";
import { IAdminUseCase } from "./I_usecases/I_adminusecase";

export class AdminUseCase implements IAdminUseCase {
  constructor(
    private clientRepo: IClientRepository,
    private userRepo: IUserRepository,
    private addressRepo: IAddressRepository
  ) {}
  async fetchUsersByRole(role: "lawyer" | "client"): Promise<Client[]> {
    const users = await this.userRepo.findByRole(role);

    const clients = await this.clientRepo.findAll();
    const clientMap = new Map(
      clients.map((client) => [client.user_id, client])
    );

    const responseData = users
      .map((user) => {
        const client = clientMap.get(user.user_id);
        if (!client) return null;
        return {
          user_id: user.user_id,
          name: user.name,
          email: user.email,
          role: user.role,
          is_verified: user.is_verified,
          is_blocked: user.is_blocked,
          createdAt: user.createdAt,
          profile_image: client.profile_image || null,
          dob: client.dob || null,
          gender: client.gender || null,
          address: client.address || null,
        };
      })
      .filter(Boolean);

    return responseData as Client[];
  }
}
