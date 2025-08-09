import { User } from "@domain/entities/User";
import { IMapper } from "../IMapper";
import { IUserModel } from "@infrastructure/database/model/UserModel";

export class UserMapper implements IMapper<User, IUserModel> {
  toDomain(raw: IUserModel): User {
    return User.fromPersistence({
      id: raw._id.toString(),
      user_id: raw.user_id,
      email: raw.email,
      name: raw.name,
      mobile: raw.mobile,
      password: raw.password,
      role: raw.role,
      is_blocked: raw.is_blocked,
      is_verified: raw.is_verified,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    });
  }
  toPersistence(raw: User): Partial<IUserModel> {
    return {
      _id: raw.id,
      user_id: raw.user_id,
      name: raw.name,
      email: raw.email,
      mobile: raw.mobile,
      password: raw.password,
      role: raw.role,
      is_blocked: raw.is_blocked,
      is_verified: raw.is_verified,
    };
  }

    toDomainArray(raw: IUserModel[]): User[] {
      return raw.map((r) => this.toDomain(r));
    }
}
