import {
  Session,
  SessionDocument,
} from "../../../domain/entities/Session.entity";
import { ISessionsRepo } from "../../../domain/I_repository/I_sessions.repo";
import { SessionDocumentModel, SessionModel } from "../model/sessions.model";
export class SessionsRepository implements ISessionsRepo {
  async aggregate(payload: {
    user_id: string;
    role: "lawyer" | "client";
    search: string;
    sort: "name" | "date" | "consultation_fee";
    order: "asc" | "desc";
    status?: "upcoming" | "ongoing" | "completed" | "cancelled" | "missed";
    consultation_type?: "consultation" | "follow-up";
    page: number;
    limit: number;
  }): Promise<{
    data: any;
    totalCount: number;
    currentPage: number;
    totalPage: number;
  }> {
    const {
      page = 1,
      limit = 10,
      search = "",
      sort = "name",
      order = "asc",
      consultation_type,
      status,
      user_id,
      role,
    } = payload;
    const matchStage: Record<string, any> = {};
    if (role === "client") {
      matchStage["client_id"] = user_id;
    } else if (role === "lawyer") {
      matchStage["lawyer_id"] = user_id;
    }
    const sortStage: Record<string, any> = {};
    if (sort === "name") {
      sortStage["userData.name"] = order === "asc" ? 1 : -1;
    } else if (sort === "consultation_fee") {
      sortStage["amount"] = order === "asc" ? 1 : -1;
    } else if (sort === "date") {
      sortStage["schedule_at"] = order === "asc" ? 1 : -1;
    }
    if (
      status &&
      ["upcoming", "ongoing", "completed", "cancelled", "missed"].includes(
        status
      )
    ) {
      matchStage["status"] = status;
    }
    if (
      consultation_type &&
      ["consultation", "follow-up"].includes(consultation_type)
    ) {
      matchStage["type"] = consultation_type;
    }
    const countPipeline: any[] = [{ $match: matchStage }];
    const dataPipeline: any[] = [{ $match: matchStage }];
    if (role === "lawyer") {
      const lawyerlookups = [
        {
          $lookup: {
            from: "users",
            localField: "client_id",
            foreignField: "user_id",
            as: "userData",
          },
        },
        {
          $lookup: {
            from: "clients",
            localField: "client_id",
            foreignField: "user_id",
            as: "clientData",
          },
        },
        {
          $addFields: {
            userData: { $arrayElemAt: ["$userData", 0] },
            clientData: { $arrayElemAt: ["$clientData", 0] },
          },
        },
      ];
      dataPipeline.push(...lawyerlookups);
      countPipeline.push(...lawyerlookups);
    }

    if (role === "client") {
      const clientlookups = [
        {
          $lookup: {
            from: "users",
            localField: "lawyer_id",
            foreignField: "user_id",
            as: "userData",
          },
        },
        {
          $lookup: {
            from: "clients",
            localField: "lawyer_id",
            foreignField: "user_id",
            as: "clientData",
          },
        },
        {
          $lookup: {
            from: "lawyers",
            localField: "client_id",
            foreignField: "user_id",
            as: "lawyerData",
          },
        },
        {
          $addFields: {
            userData: { $arrayElemAt: ["$userData", 0] },
            clientData: { $arrayElemAt: ["$clientData", 0] },
            lawyerData: { $arrayElemAt: ["$lawyerData", 0] },
          },
        },
        {
          $project: { "lawyerData.documents": 0 },
        },
      ];
      dataPipeline.push(...clientlookups);
      countPipeline.push(...clientlookups);
    }
    const matchStage2: Record<string, any> = {
      $or: [
        { "userData.name": { $regex: search, $options: "i" } },
        { "userData.email": { $regex: search, $options: "i" } },
      ],
    };
    dataPipeline.push(
      { $match: matchStage2 },
      { $project: { "userData.password": 0 } },
      { $sort: sortStage },
      { $skip: (page - 1) * limit },
      { $limit: limit }
    );

    countPipeline.push({ $count: "total" });
    const [dataResult, countResult] = await Promise.all([
      SessionModel.aggregate(dataPipeline),
      SessionModel.aggregate(countPipeline),
    ]);
    // console.log("dataResult", dataResult);
    const totalCount = countResult[0]?.total || 0;
    const totalPage = Math.ceil(totalCount / limit);
    return {
      data: dataResult,
      totalCount,
      currentPage: page,
      totalPage,
    };
  }

  async create(payload: Session): Promise<Session> {
    const newSessions = new SessionModel(payload);
    const savedSession = await newSessions.save();
    return {
      ...savedSession.toObject(),
      _id: savedSession._id?.toString(),
    } as Session;
  }

  async update(payload: {
    session_id: string;
    status?: Session["status"];
    start_time?: Date;
    end_time?: Date;
    client_joined_at?: Date;
    lawyer_joined_at?: Date;
    notes?: string;
    summary?: string;
    follow_up_suggested?: boolean;
    follow_up_session_id?: string;
  }): Promise<Session | null> {
    const update: any = {};
    if (payload.status) {
      update.status = payload.status;
    }
    if (payload.start_time) {
      update.start_time = payload.start_time;
    }
    if (payload.end_time) {
      update.end_time = payload.end_time;
    }
    if (payload.client_joined_at) {
      update.client_joined_at = payload.client_joined_at;
    }
    if (payload.lawyer_joined_at) {
      update.lawyer_joined_at = payload.lawyer_joined_at;
    }
    if (payload.notes) {
      update.notes = payload.notes;
    }
    if (payload.summary) {
      update.summary = payload.summary;
    }
    if (payload.follow_up_suggested) {
      update.follow_up_suggested = payload.follow_up_suggested;
    }
    if (payload.follow_up_session_id) {
      update.follow_up_session_id = payload.follow_up_session_id;
    }
    if (Object.keys(update).length === 0) {
      return null;
    }

    const sessions = await SessionModel.findOneAndUpdate(
      {
        _id: payload.session_id,
      },
      { $set: update },
      { new: true }
    );

    return sessions
      ? { ...sessions.toObject(), _id: sessions._id?.toString() }
      : null;
  }

  async findById(payload: { session_id: string }): Promise<Session | null> {
    const sessions = await SessionModel.findById(payload.session_id);
    return sessions
      ? { ...sessions.toObject(), _id: sessions._id?.toString() }
      : null;
  }

  // session Document
  async createDocument(
    payload: SessionDocument
  ): Promise<SessionDocument | null> {
    const newSession = new SessionDocumentModel(payload);
    await newSession.save();
    if (!newSession) return null;
    return {
      ...newSession.toObject(),
      _id: (newSession._id as any).toString(),
      session_id: newSession.session_id?.toString(),
    };
  }

  
  async findDocumentBySessionId(payload: {
    session_id: string;
  }): Promise<SessionDocument | null> {
    const document = await SessionDocumentModel.findOne({
      session_id: payload.session_id,
    });
    if (!document) return null;
    return {
      ...document.toObject(),
      _id: document._id?.toString(),
      session_id: document.session_id?.toString(),
    };
  }
}
