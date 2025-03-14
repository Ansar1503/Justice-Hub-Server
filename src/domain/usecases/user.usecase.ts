import { UserRepository } from "../../infrastructure/database/repo/user.repo";
import { User } from "../entities/User.entity";
import bcrypt from "bcryptjs";

export class UserUseCase {
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  private async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }

  async createUser(userData: User) {
    userData.password = await this.hashPassword(userData.password);
    return this.userRepository.create(userData);
  }

  async findUser(email: string) {
    return this.userRepository.findByEmail(email);
  }
}
