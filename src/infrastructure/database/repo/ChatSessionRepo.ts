import { ChatSession } from "@domain/entities/ChatSession";
import { IChatSessionRepo } from "@domain/IRepository/IChatSessionRepo";
import { IMapper } from "@infrastructure/Mapper/IMapper";
import { ChatModel, IChatSessionModel } from "../model/ChatSessionModel";
import { Types } from "mongoose";
import { ChatSessionMapper } from "@infrastructure/Mapper/Implementations/ChatSessionMapper";

export class ChatSessionRepository implements IChatSessionRepo {
  constructor(
    private mapper: IMapper<
      ChatSession,
      IChatSessionModel
    > = new ChatSessionMapper()
  ) {}
  async create(payload: ChatSession): Promise<ChatSession> {
    const chat = new ChatModel(this.mapper.toPersistence(payload));
    await chat.save();
    return this.mapper.toDomain(chat);
  }
  async aggregate(payload: {
    user_id: string;
    search: string;
    page: number;
    role: "lawyer" | "client";
  }): Promise<{ data: any[]; nextCursor?: number }> {
    const { user_id, page = 1, search = "", role } = payload;
    const limit = 10;
    const skip = page > 0 ? Math.abs(page - 1) * limit : 0;

    const matchStage = {
      [role === "client" ? "participants.client_id" : "participants.lawyer_id"]:
        user_id,
    };
    if (search.trim()) {
      matchStage["name"] = search;
    }

    const pipeline: any[] = [
      { $match: matchStage },

      // client detaisl
      {
        $lookup: {
          from: "users",
          localField: "participants.client_id",
          foreignField: "user_id",
          as: "userDetails",
        },
      },
      { $unwind: { path: "$userDetails", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "clients",
          localField: "participants.client_id",
          foreignField: "user_id",
          as: "clientProfile",
        },
      },
      { $unwind: { path: "$clientProfile", preserveNullAndEmptyArrays: true } },
      {
        $addFields: {
          clientData: { $mergeObjects: ["$userDetails", "$clientProfile"] },
        },
      },
      {
        $project: {
          userDetails: 0,
          clientProfile: 0,
          "clientData.password": 0,
        },
      },

      // lawyer detaisl
      {
        $lookup: {
          from: "users",
          localField: "participants.lawyer_id",
          foreignField: "user_id",
          as: "userDetails",
        },
      },
      { $unwind: { path: "$userDetails", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "clients",
          localField: "participants.lawyer_id",
          foreignField: "user_id",
          as: "lawyerClientProfile",
        },
      },
      {
        $unwind: {
          path: "$lawyerClientProfile",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "lawyers",
          localField: "participants.lawyer_id",
          foreignField: "user_id",
          as: "lawyerProfile",
        },
      },
      { $unwind: { path: "$lawyerProfile", preserveNullAndEmptyArrays: true } },
      {
        $addFields: {
          lawyerData: {
            $mergeObjects: [
              "$userDetails",
              "$lawyerProfile",
              "$lawyerClientProfile",
            ],
          },
        },
      },
      {
        $project: {
          userDetails: 0,
          lawyerProfile: 0,
          lawyerClientProfile: 0,
          "lawyerData.password": 0,
        },
      },

      //  session details
      {
        $lookup: {
          from: "sessions",
          localField: "session_id",
          foreignField: "_id",
          as: "sessionDetails",
        },
      },
      {
        $unwind: { path: "$sessionDetails", preserveNullAndEmptyArrays: true },
      },

      //  last message
      {
        $lookup: {
          from: "messages",
          localField: "last_message",
          foreignField: "_id",
          as: "lastMessage",
        },
      },
      { $unwind: { path: "$lastMessage", preserveNullAndEmptyArrays: true } },
    ];

    // if (search.trim() !== "") {
    //   console.log("search", search);
    //   pipeline.push({
    //     $match: {
    //       $or: [
    //         { "clientData.name": { $regex: search, $options: "i" } },
    //         { "lawyerData.name": { $regex: search, $options: "i" } },
    //       ],
    //     },
    //   });
    // }

    pipeline.push({ $sort: { updatedAt: -1 } });
    pipeline.push({ $skip: skip });
    pipeline.push({ $limit: limit + 1 });

    const results = await ChatModel.aggregate(pipeline);

    const hasNextPage = results.length > limit;
    const data = hasNextPage ? results.slice(0, limit) : results;

    return {
      data,
      nextCursor: hasNextPage ? page + 1 : undefined,
    };
  }
  async update(payload: {
    name?: string;
    last_message?: string;
    id: string;
  }): Promise<ChatSession | null> {
    const update: any = {};
    if (payload.name) {
      update.name = payload.name;
    }
    if (payload.last_message) {
      update.last_message = new Types.ObjectId(payload.last_message);
    }

    const updatedChatSession = await ChatModel.findOneAndUpdate(
      { _id: payload.id },
      update,
      { new: true }
    );
    if (!updatedChatSession) return null;

    return this.mapper.toDomain(updatedChatSession);
  }

  async findById(id: string): Promise<ChatSession | null> {
    const data = await ChatModel.findOne({ _id: id });
    return data ? this.mapper.toDomain(data) : null;
  }
}
