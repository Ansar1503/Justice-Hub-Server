import { Types } from "mongoose";
import { ChatSession } from "../../../domain/entities/Chat.entity";
import { IChatRepo } from "../../../domain/I_repository/IChatRepo";
import { ChatModel } from "../model/chat.model";

export class ChatRepo implements IChatRepo {
  async create(payload: ChatSession): Promise<ChatSession> {
    const createPayload = {
      participants: payload.participants,
      session_id:
        payload.session_id && Types.ObjectId.isValid(payload.session_id)
          ? new Types.ObjectId(payload.session_id)
          : undefined,
      last_message:
        payload.last_message && Types.ObjectId.isValid(payload.last_message)
          ? new Types.ObjectId(payload.last_message)
          : undefined,
    };

    const chat = new ChatModel(createPayload);
    await chat.save();
    return {
      ...chat,
      last_message: chat.last_message?.toString() || "",
      session_id: chat.session_id.toString(),
      _id: chat._id?.toString(),
    };
  }
  async aggregate(payload: {
    user_id: string;
    search: string;
    role: "lawyer" | "client";
    page: number;
  }): Promise<{ data: any[]; nextCursor?: number }> {
    const { user_id, page = 1, search = "", role } = payload;
    const limit = 10;
    const skip = page > 0 ? Math.abs(page - 1) * limit : 0;

    const matchStage = {
      [role === "client" ? "participants.client_id" : "participants.lawyer_id"]:
        user_id,
    };

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

    if (search.trim() !== "") {
      pipeline.push({
        $match: {
          $or: [
            { "clientData.name": { $regex: search, $options: "i" } },
            { "lawyerData.name": { $regex: search, $options: "i" } },
          ],
        },
      });
    }

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
}
