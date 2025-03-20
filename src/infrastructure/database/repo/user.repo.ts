import { User } from "../../../domain/entities/User.entity";
import { IUserRepository } from "../../../domain/repository/user.repo";
import UserModel, { IUserModel } from "../model/user.model";

export class UserRepository implements IUserRepository {
  async create(user: User): Promise<IUserModel> {
    return await new UserModel(user).save();
  }

  async findByEmail(email: string): Promise<IUserModel | null> {
    return await UserModel.findOne({ email });
  }

  async findByuser_id(user_id: string): Promise<IUserModel | null> {
    return await UserModel.findOne({ user_id });
  }
}
