import { IMapper } from "@infrastructure/Mapper/IMapper";
import { LawyerMapper } from "@infrastructure/Mapper/Implementations/LawyerMapper";
import { ClientSession } from "mongoose";
import { LawyerprofessionalDetailsDto } from "@src/application/dtos/Lawyer/LawyerProfessionalDetailsDto";
import { Lawyer } from "../../../domain/entities/Lawyer";
import { ILawyerRepository } from "../../../domain/IRepository/ILawyerRepo";
import lawyerModel, { ILawyerModel } from "../model/LawyerModel";
import { IPracticeareaModel } from "../model/PracticeAreaModel";
import { ISpecializationModel } from "../model/SpecializationModel";

export class LawyerRepository implements ILawyerRepository {
    constructor(
        private mapper: IMapper<Lawyer, ILawyerModel> = new LawyerMapper(),
        private _session?: ClientSession,
    ) {}

    async create(lawyer: Lawyer): Promise<Lawyer> {
        const mapped = this.mapper.toPersistence(lawyer);
        const lawyerData = await lawyerModel.create([mapped], {
            session: this._session,
        });
        return this.mapper.toDomain(lawyerData[0]);
    }
    async findUserId(user_id: string): Promise<LawyerprofessionalDetailsDto | null> {
        const lawyerData = await lawyerModel
            .findOne({ userId: user_id }, {}, { session: this._session })
            .populate<{ practiceAreas: IPracticeareaModel[] | [] }>("practiceAreas")
            .populate<{ specialisations: ISpecializationModel[] | [] }>("specialisations");
        if (!lawyerData) return null;
        return {
            consultationFee: lawyerData.consultationFee,
            createdAt: lawyerData.createdAt,
            description: lawyerData.description,
            experience: lawyerData.experience,
            id: lawyerData._id,
            practiceAreas: !lawyerData.practiceAreas
                ? []
                : lawyerData.practiceAreas.map((p) => ({
                    createdAt: p?.createdAt,
                    id: p._id,
                    name: p.name,
                    specializationId: p.specializationId,
                    updatedAt: p.updatedAt,
                })),
            specializations: !lawyerData.specialisations
                ? []
                : lawyerData.specialisations.map((p) => ({
                    createdAt: p.createdAt,
                    id: p._id,
                    name: p.name,
                    updatedAt: p.updatedAt,
                })),
            updatedAt: lawyerData.updatedAt,
            userId: lawyerData.userId,
        };
    }
    async update(update: Partial<Lawyer>): Promise<Lawyer | null> {
        const mapped = this.mapper.toPersistence(update as Lawyer);
        const updatedData = await lawyerModel.findOneAndUpdate({ userId: update.userId }, mapped, {
            upsert: true,
            new: true,
            session: this._session,
        });
        return updatedData ? this.mapper.toDomain(updatedData) : null;
    }
    async findAll(): Promise<Lawyer[] | []> {
        const lawyerData = await lawyerModel.find({}).populate("documents");
        return lawyerData ? (this.mapper?.toDomainArray?.(lawyerData) ?? []) : [];
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
                    localField: "userId",
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
                    localField: "userId",
                    foreignField: "user_id",
                    as: "address",
                },
            },
            { $unwind: { path: "$address", preserveNullAndEmptyArrays: true } },
            {
                $lookup: {
                    from: "lawyerverifications",
                    localField: "userId",
                    foreignField: "userId",
                    as: "lawyerVerificationDetails",
                },
            },
            {
                $unwind: {
                    path: "$lawyerVerificationDetails",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: "specializations",
                    localField: "specialisations",
                    foreignField: "_id",
                    as: "specialisationsDetails",
                },
            },

            {
                $lookup: {
                    from: "practiceareas",
                    localField: "practiceAreas",
                    foreignField: "_id",
                    as: "practiceAreasDetails",
                },
            },

            {
                $match: {
                    "lawyerVerificationDetails.verificationStatus": "verified",
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
                    localField: "userId",
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
                $lookup: {
                    from: "LawyerVerification",
                    localField: "userId",
                    foreignField: "userId",
                    as: "lawyerVerificationDetails",
                },
            },
            {
                $unwind: {
                    path: "$lawyerVerificationDetails",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: "specializations",
                    localField: "specialisations",
                    foreignField: "_id",
                    as: "specialisationsDetails",
                },
            },
            {
                $lookup: {
                    from: "practiceareas",
                    localField: "practiceAreas",
                    foreignField: "_id",
                    as: "practiceAreasDetails",
                },
            },
            {
                $match: {
                    "lawyerVerificationDetails.verificationStatus": "verified",
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
