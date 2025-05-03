import { User } from "../../../domain/entities/User.entity";
import { IUserRepository } from "../../../domain/I_repository/I_user.repo";
import UserModel, { IUserModel } from "../model/user.model";

export class UserRepository implements IUserRepository {
  async create(user: User): Promise<User> {
    return await new UserModel(user).save();
  }

  async findByEmail(email: string): Promise<User | null> {
    return await UserModel.findOne({ email });
  }

  async findByuser_id(user_id: string): Promise<User | null> {
    return await UserModel.findOne({ user_id });
  }
  async update(user: Partial<User>): Promise<User | null> {
    let query: { user_id?: string; email?: string } = {};
    if (user.user_id) {
      query.user_id = user.user_id;
    } else if (user.email) {
      query.email = user.email;
    }
    return await UserModel.findOneAndUpdate(
      query,
      {
        $set: {
          is_verified: user.is_verified,
          name: user.name,
          mobile: user.mobile,
          email: user.email,
          is_blocked: user.is_blocked,
          password: user.password,
          role: user.role,
        },
      },
      { new: true }
    );
  }
  async findAll(query:any): Promise<User[]> {
    return await UserModel.find(query);
  }
}
