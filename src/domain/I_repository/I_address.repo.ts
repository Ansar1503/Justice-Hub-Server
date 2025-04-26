import { Address } from "../entities/Address.entity";
import { Client } from "../entities/Client.entity";

export interface IAddressRepository {
  find(user_id: string): Promise<(Address & { user_id: string }) | null>;
  update(
    payload: Address & { user_id: string }
  ): Promise<Address & { user_id: string; _id: string }>;
}
