import { IMapper } from "@infrastructure/Mapper/IMapper";
import { AddressMapper } from "@infrastructure/Mapper/Implementations/AddressMapper";
import { Address } from "../../../domain/entities/Address";
import { IAddressRepository } from "../../../domain/IRepository/IAddressRepo";
import AddressModel, { IAddresModel } from "../model/AddressModel";

export class AddressRepository implements IAddressRepository {
    constructor(private _mapper: IMapper<Address, IAddresModel> = new AddressMapper()) {}

    async update(payload: Address): Promise<Address> {
        const data = await AddressModel.findOneAndUpdate(
            { user_id: payload.user_id },
            {
                $set: {
                    city: payload.city,
                    locality: payload.locality,
                    pincode: payload.pincode,
                    state: payload.state,
                },
            },
            { upsert: true, new: true },
        );
        return this._mapper.toDomain(data);
    }
    async find(user_id: string): Promise<Address | null> {
        const data = await AddressModel.findOne({ user_id: user_id });
        return data ? this._mapper.toDomain(data) : null;
    }
    async findAll(): Promise<Address[]> {
        const data = await AddressModel.find({});
        return data && this._mapper.toDomainArray ? this._mapper.toDomainArray(data) : [];
    }
}
