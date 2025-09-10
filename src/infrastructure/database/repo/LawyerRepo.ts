import { IMapper } from "@infrastructure/Mapper/IMapper";
import { Lawyer } from "../../../domain/entities/Lawyer";
import { ILawyerRepository } from "../../../domain/IRepository/ILawyerRepo";
import lawyerModel, { ILawyerModel } from "../model/LawyerModel";
import { LawyerMapper } from "@infrastructure/Mapper/Implementations/LawyerMapper";
import { ClientSession } from "mongoose";

export class LawyerRepository implements ILawyerRepository {
  constructor(
    private mapper: IMapper<Lawyer, ILawyerModel> = new LawyerMapper(),
    private _session?: ClientSession
  ) {}

  async create(lawyer: Lawyer): Promise<Lawyer> {
    const mapped = this.mapper.toPersistence(lawyer);
    const lawyerData = await lawyerModel.create([mapped], {
      session: this._session,
    });
    return this.mapper.toDomain(lawyerData[0]);
  }
  async findUserId(user_id: string): Promise<Lawyer | null> {
    const lawyerData = await lawyerModel
      .findOne({ user_id }, {}, { session: this._session })
      .populate("documents")
      .populate("practiceAreas")
      .populate("specialisations");

    return lawyerData ? this.mapper.toDomain(lawyerData) : null;
  }
  async update(update: Partial<Lawyer>): Promise<Lawyer | null> {
    const mapped = this.mapper.toPersistence(update as Lawyer);
    const updatedData = await lawyerModel.findOneAndUpdate(
      { user_id: update.userId },
      mapped,
      {
        upsert: true,
        new: true,
        session: this._session,
      }
    );
    return updatedData ? this.mapper.toDomain(updatedData) : null;
  }
  async findAll(): Promise<Lawyer[] | []> {
    const lawyerData = await lawyerModel.find({}).populate("documents");
    return lawyerData ? this.mapper?.toDomainArray?.(lawyerData) ?? [] : [];
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

    const countPipeline = [
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
      { $count: "total" },
    ];

    const [lawyers, countResult] = await Promise.all([
      lawyerModel.aggregate(pipeline),
      lawyerModel.aggregate(countPipeline),
    ]);
    const totalCount = countResult[0]?.total || 0;
    const totalPages = Math.ceil(totalCount / query.limit);
    return {
      data: lawyers,
      totalCount,
      currentPage: query.page,
      totalPages,
    };
  }
}
