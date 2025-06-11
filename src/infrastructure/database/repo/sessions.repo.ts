import { Session } from "../../../domain/entities/Session.entity";
import { ISessionsRepo } from "../../../domain/I_repository/I_sessions.repo";
import { SessionModel } from "../model/sessions.model";
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
}
