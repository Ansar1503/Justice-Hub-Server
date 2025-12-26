import { ChatMessage } from "@domain/entities/ChatMessage";
import { IChatMessagesRepo } from "@domain/IRepository/IChatMessagesRepo";
import { IMapper } from "@infrastructure/Mapper/IMapper";
import { ChatMessageMapper } from "@infrastructure/Mapper/Implementations/ChatMessageMapper";
import { IChatMessageModel, MessageModel } from "../model/ChatMessageModel";

export class ChatMessageRepository implements IChatMessagesRepo {
    constructor(private _mapper: IMapper<ChatMessage, IChatMessageModel> = new ChatMessageMapper()) {}
    async create(payload: ChatMessage): Promise<ChatMessage> {
        const newmessage = new MessageModel(this._mapper.toPersistence(payload));
        await newmessage.save();
        return this._mapper.toDomain(newmessage);
    }
    async findMessagesBySessionId(
        id: string,
        page: number,
    ): Promise<{ data: ChatMessage[] | []; nextCursor?: number }> {
        const limit = 10;
        const skip = page > 0 ? (page - 1) * limit : 0;
        const messages = await MessageModel.find({ session_id: id, active: true })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit + 1);
        const hasNextPage = messages.length > limit;
        const data = hasNextPage ? messages.slice(0, limit) : messages;

        return {
            data: this._mapper.toDomainArray && data ? this._mapper.toDomainArray(data).reverse() : [],
            nextCursor: hasNextPage ? page + 1 : undefined,
        };
    }
    async update(payload: {
        messageId: string;
        reason?: string;
        reportedAt?: Date;
        read?: boolean;
        active?: boolean;
    }): Promise<ChatMessage | null> {
        const { messageId, reason, reportedAt, read, active } = payload;

        const update: {
            read?: boolean;
            report?: { reason?: string; reportedAt?: Date };
            active?: boolean;
        } = {};

        if (reason || reportedAt) {
            update.report = {};
            if (reason) update.report.reason = reason;
            if (reportedAt) update.report.reportedAt = reportedAt;
        }
        if (active !== undefined || active !== null) {
            if (typeof active === "boolean") {
                update.active = active;
            }
        }
        if (typeof read === "boolean") {
            update.read = read;
        }

        const data = await MessageModel.findOneAndUpdate({ _id: messageId }, { $set: update }, { new: true });

        return data ? this._mapper.toDomain(data) : null;
    }
    async findById(messageId: string): Promise<ChatMessage | null> {
        const data = await MessageModel.findOne({ _id: messageId });
        return data ? this._mapper.toDomain(data) : null;
    }
    async fetchDisputesAggregation(payload: {
        search: string;
        sortBy: "All" | "session_date" | "reported_date";
        sortOrder: "asc" | "desc";
        limit: number;
        page: number;
    }): Promise<{
        data: (ChatMessage & { chatSession: any & { clientData: any; lawyerData: any } }[]) | [];
        totalCount: number;
        currentPage: number;
        totalPage: number;
    }> {
        const { search, sortBy, sortOrder, limit, page } = payload;
        const skip = (page - 1) * limit;
        const order = sortOrder === "asc" ? 1 : -1;
        const matchStageFilter1: Record<string, any> = {
            report: { $exists: true, $ne: null },
            "report.reason": { $exists: true, $ne: "" },
            active: true,
        };
        const matchStageFilter2: Record<string, any> = {};
        if (search.trim()) {
            matchStageFilter2["$or"] = [
                { "clientData.name": search },
                { "lawyerData.name": search },
                { "chatSession.name": search },
            ];
        }
        const sortStageFilter: Record<string, any> = { createdAt: -1 };
        if (sortBy !== "All") {
            if (sortBy === "session_date") {
                sortStageFilter["chatSession.createdAt"] = order;
            } else if (sortBy === "reported_date") {
                sortStageFilter["report.reportedAt"] = order;
            }
        }
        const pipline: any[] = [
            { $match: matchStageFilter1 },
            {
                $lookup: {
                    from: "chats",
                    localField: "session_id",
                    foreignField: "_id",
                    pipeline: [
                        {
                            $lookup: {
                                from: "users",
                                localField: "participants.client_id",
                                foreignField: "user_id",
                                as: "clientUserData",
                            },
                        },
                        {
                            $unwind: {
                                path: "$clientUserData",
                                preserveNullAndEmptyArrays: true,
                            },
                        },
                        {
                            $lookup: {
                                from: "clients",
                                localField: "participants.client_id",
                                foreignField: "user_id",
                                as: "clientClientData",
                            },
                        },
                        {
                            $unwind: {
                                path: "$clientClientData",
                                preserveNullAndEmptyArrays: true,
                            },
                        },
                        {
                            $addFields: {
                                clientData: {
                                    $mergeObjects: ["$clientUserData", "$clientClientData"],
                                },
                            },
                        },
                        {
                            $project: {
                                "clientData.password": 0,
                                clientUserData: 0,
                                clientClientData: 0,
                            },
                        },
                        // lawyers querys
                        {
                            $lookup: {
                                from: "users",
                                localField: "participants.lawyer_id",
                                foreignField: "user_id",
                                as: "lawyerUserData",
                            },
                        },
                        {
                            $unwind: {
                                path: "$lawyerUserData",
                                preserveNullAndEmptyArrays: true,
                            },
                        },
                        {
                            $lookup: {
                                from: "clients",
                                localField: "participants.lawyer_id",
                                foreignField: "user_id",
                                as: "lawyerClientData",
                            },
                        },
                        {
                            $unwind: {
                                path: "$lawyerClientData",
                                preserveNullAndEmptyArrays: true,
                            },
                        },
                        {
                            $addFields: {
                                lawyerData: {
                                    $mergeObjects: ["$lawyerUserData", "$lawyerClientData"],
                                },
                            },
                        },
                        {
                            $project: {
                                "lawyerData.password": 0,
                                lawyerUserData: 0,
                                lawyerClientData: 0,
                            },
                        },
                    ],
                    as: "chatSession",
                },
            },
            {
                $unwind: {
                    path: "$chatSession",
                    preserveNullAndEmptyArrays: true,
                },
            },
            { $match: matchStageFilter2 },
            { $sort: sortStageFilter },
            { $skip: skip },
            { $limit: limit },
        ];
        const [{ data, count }] = await MessageModel.aggregate([
            {
                $facet: {
                    data: pipline,
                    count: [{ $match: matchStageFilter1 }, { $match: matchStageFilter2 }, { $count: "count" }],
                },
            },
        ]);
        const totalCount = count[0]?.count || 0;
        const totalPage = Math.ceil(totalCount / limit);
        return {
            currentPage: page,
            totalPage,
            totalCount,
            data,
        };
    }
}
