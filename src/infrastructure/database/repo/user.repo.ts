import { User } from "../../../domain/entities/User.entity";
import { IUserRepository } from "../../../domain/repository/user.repo";
import UserModel from "../model/user.model";

export class UserRepository implements IUserRepository {
  async create(user: User) {
    return await new UserModel(user).save();
  }

  async findByEmail(email: string) {
    return await UserModel.findOne({ email });
  }
}