import { lawyer } from "../../../domain/entities/Lawyer.entity";
import { ILawyerRepository } from "../../../domain/I_repository/I_lawyer.repo";
import lawyerMoel from "../model/lawyer.model";

export class LawyerRepository implements ILawyerRepository {
  async create(lawyer: lawyer): Promise<lawyer> {
    return await lawyerMoel.create(lawyer);
  }
  async findUserId(user_id: string): Promise<lawyer | null> {
    return await lawyerMoel.findOne({ user_id });
  }
  async update(user_id: string, lawyer: lawyer): Promise<lawyer | null> {
    return await lawyerMoel.findOneAndUpdate({ user_id }, {}, { new: true });
  }
}
