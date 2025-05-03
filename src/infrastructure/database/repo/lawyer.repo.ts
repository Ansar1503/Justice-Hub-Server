import {
  lawyer,
  LawyerFilterParams,
} from "../../../domain/entities/Lawyer.entity";
import { ILawyerRepository } from "../../../domain/I_repository/I_lawyer.repo";
import lawyerModel from "../model/lawyer.model";

export class LawyerRepository implements ILawyerRepository {
  async create(lawyer: lawyer): Promise<lawyer> {
    return await lawyerModel.create(lawyer);
  }
  async findUserId(user_id: string): Promise<lawyer | null> {
    return await lawyerModel.findOne({ user_id }).populate("documents");
  }
  async update(
    user_id: string,
    lawyer: Partial<lawyer>
  ): Promise<lawyer | null> {
    return await lawyerModel.findOneAndUpdate(
      { user_id },
      {
        $set: {
          description: lawyer.description || "",
          documents: lawyer.documents || "",
          barcouncil_number: lawyer.barcouncil_number || "",
          enrollment_certificate_number:
            lawyer.enrollment_certificate_number || "",
          certificate_of_practice_number:
            lawyer.certificate_of_practice_number || "",
          practice_areas: lawyer.practice_areas || "",
          verification_status: lawyer.verification_status || "",
          rejectReason: lawyer.rejectReason || "",
          experience: lawyer.experience || "",
          specialisation: lawyer.specialisation || "",
          consultation_fee: lawyer.consultation_fee || "",
        },
      },
      { upsert: true, new: true }
    );
  }
  async findAll(): Promise<lawyer[]> {
    return await lawyerModel.find({}).populate("documents");
  }
  async findAllLawyersWithQuery(query: {
    matchStage: any;
    sortStage: any;
    search: string;
    page: number;
    limit: number;
  }): Promise<any> {
    const pipeline = [
      { $match: query.matchStage },
      {
        $lookup: {
          from: "users",
          localField: "user_id",
          foreignField: "user_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $lookup: {
          from: "clients",
          localField: "user.user_id",
          foreignField: "user_id",
          as: "client",
        },
      },
      { $unwind: { path: "$client", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "addresses",
          localField: "client.address",
          foreignField: "_id",
          as: "address",
        },
      },
      { $unwind: { path: "$address", preserveNullAndEmptyArrays: true } },
      {
        $match: {
          $or: [
            { "user.name": { $regex: query.search, $options: "i" } },
            { "user.email": { $regex: query.search, $options: "i" } },
          ],
        },
      },
      { $sort: query.sortStage },
      { $skip: (query.page - 1) * query.limit },
      { $limit: query.limit },
    ];
    const result = await lawyerModel.aggregate(pipeline);
    return result;
  }
}
