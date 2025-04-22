import { Address } from "../../../domain/entities/Address.entity";
import { IAddressRepository } from "../../../domain/repository/address.repo";
import AddressModel from "../model/address.model";

export class AddressRepository implements IAddressRepository {
  async update(
    payload: Address & { user_id: string }
  ): Promise<Address & { user_id: string; _id: string }> {
    return await AddressModel.findOneAndUpdate(
      { user_id: payload.user_id },
      {
        $set: {
          city: payload.city,
          locality: payload.locality,
          pincode: payload.pincode,
          state: payload.state,
        },
      },
      { upsert: true, new: true }
    );
  }
  async find(user_id: string): Promise<(Address & { user_id: string }) | null> {
    return await AddressModel.findOne({ user_id: user_id });
  }
}
