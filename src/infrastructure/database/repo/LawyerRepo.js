"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LawyerRepository = void 0;
const LawyerMapper_1 = require("@infrastructure/Mapper/Implementations/LawyerMapper");
const LawyerModel_1 = __importDefault(require("../model/LawyerModel"));
class LawyerRepository {
    mapper;
    _session;
    constructor(mapper = new LawyerMapper_1.LawyerMapper(), _session) {
        this.mapper = mapper;
        this._session = _session;
    }
    async create(lawyer) {
        const mapped = this.mapper.toPersistence(lawyer);
        const lawyerData = await LawyerModel_1.default.create([mapped], {
            session: this._session,
        });
        return this.mapper.toDomain(lawyerData[0]);
    }
    async findUserId(user_id) {
        const lawyerData = await LawyerModel_1.default
            .findOne({ userId: user_id }, {}, { session: this._session })
            .populate("practiceAreas")
            .populate("specialisations");
        if (!lawyerData)
            return null;
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
    async update(update) {
        const mapped = this.mapper.toPersistence(update);
        const updatedData = await LawyerModel_1.default.findOneAndUpdate({ userId: update.userId }, mapped, {
            upsert: true,
            new: true,
            session: this._session,
        });
        return updatedData ? this.mapper.toDomain(updatedData) : null;
    }
    async findAll() {
        const lawyerData = await LawyerModel_1.default.find({}).populate("documents");
        return lawyerData ? (this.mapper?.toDomainArray?.(lawyerData) ?? []) : [];
    }
    async findAllLawyersWithQuery(query) {
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
            { $count: "total" },
        ];
        const [lawyers, countResult] = await Promise.all([
            LawyerModel_1.default.aggregate(pipeline),
            LawyerModel_1.default.aggregate(countPipeline),
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
exports.LawyerRepository = LawyerRepository;
