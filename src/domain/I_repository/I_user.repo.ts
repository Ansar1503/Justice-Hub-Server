import { User } from "../entities/User.entity";

export interface IUserRepository {
  create(user: User): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
  update(user: Partial<User>): Promise<User | null>;
  findByuser_id(user_id: string): Promise<User | null>;
  findAll(query: any): Promise<User[]>;
}
