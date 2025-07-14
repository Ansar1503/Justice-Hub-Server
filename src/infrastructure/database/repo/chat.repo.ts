import { Types } from "mongoose";
import { ChatMessage, ChatSession } from "../../../domain/entities/Chat.entity";
import { IChatRepo } from "../../../domain/I_repository/IChatRepo";
import { ChatModel, MessageModel } from "../model/chat.model";
import { Client } from "../../../domain/entities/Client.entity";

export class ChatRepo implements IChatRepo {
  async create(payload: ChatSession): Promise<ChatSession> {
    const createPayload = {
      participants: payload.participants,
      name: payload.name,
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

    return {
      ...updatedChatSession?.toObject(),
      _id: updatedChatSession?._id?.toString(),
      session_id: updatedChatSession?.session_id.toString(),
      last_message: updatedChatSession?.last_message?.toString() || "",
    };
  }

  async findById(id: string): Promise<ChatSession | null> {
    return ChatModel.findOne({ _id: id });
  }

  // messages
  async createMessage(payload: ChatMessage): Promise<ChatMessage | null> {
    const newmessage = new MessageModel(payload);
    await newmessage.save();
    return {
      ...newmessage.toObject(),
      _id: newmessage._id?.toString(),
      session_id: newmessage.session_id.toString(),
    };
  }
  async findMessagesBySessionId(
    id: string,
    page: number
  ): Promise<{ data: ChatMessage[]; nextCursor?: number }> {
    const limit = 10;
    const skip = page > 0 ? (page - 1) * limit : 0;
    const messages = await MessageModel.find({ session_id: id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit + 1);
    const hasNextPage = messages.length > limit;
    const data = hasNextPage ? messages.slice(0, limit) : messages;

    return {
      data: data.reverse().map((msg) => ({
        ...msg.toObject(),
        session_id: msg.session_id.toString(),
        _id: msg?._id?.toString(),
      })),
      nextCursor: hasNextPage ? page + 1 : undefined,
    };
  }
  async deleteMessage(payload: { messageId: string }): Promise<void> {
    await MessageModel.findOneAndDelete({ _id: payload.messageId });
  }

  async updateMessage(payload: {
    messageId: string;
    reason?: string;
    reportedAt?: Date;
    read?: boolean;
  }): Promise<ChatMessage | null> {
    const { messageId, reason, reportedAt, read } = payload;

    const update: {
      read?: boolean;
      report?: { reason?: string; reportedAt?: Date };
    } = {};

    if (reason || reportedAt) {
      update.report = {};
      if (reason) update.report.reason = reason;
      if (reportedAt) update.report.reportedAt = reportedAt;
    }

    if (typeof read === "boolean") {
      update.read = read;
    }

    return await MessageModel.findOneAndUpdate(
      { _id: messageId },
      { $set: update },
      { new: true }
    );
  }

  async findMessageById(messageId: string): Promise<ChatMessage | null> {
    return await MessageModel.findOne({ _id: messageId });
  }

  async fetchDisputesAggregation(payload: {
    search: string;
    sortBy: "All" | "session_date" | "reported_date";
    sortOrder: "asc" | "desc";
    limit: number;
    page: number;
  }): Promise<{
    data:
      | (ChatMessage &
          {
            chatSession: ChatSession & {
              clientData: Client;
              lawyerData: Client;
            };
          }[])
      | [];
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
          count: [
            { $match: matchStageFilter1 },
            { $match: matchStageFilter2 },
            { $count: "count" },
          ],
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
