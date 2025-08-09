import { Address } from "../entities/Address";

export interface IAddressRepository {
  find(user_id: string): Promise<Address | null>;
  update(payload: Address): Promise<Address>;
  findAll(): Promise<Address[]>;
}
