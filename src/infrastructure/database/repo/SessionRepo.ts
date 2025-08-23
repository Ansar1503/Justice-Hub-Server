import { Session } from "@domain/entities/Session";
import { ISessionsRepo } from "@domain/IRepository/ISessionsRepo";
import { IMapper } from "@infrastructure/Mapper/IMapper";
import SessionModel, { ISessionModel } from "../model/SessionModel";
import {
  FetchSessionsInputDto,
  FetchSessionsOutputtDto,
} from "@src/application/dtos/sessions/FetchSessionsDto";
import { SessionMapper } from "@infrastructure/Mapper/Implementations/SessionMapper";

export class SessionsRepository implements ISessionsRepo {
  constructor(
    private mapper: IMapper<Session, ISessionModel> = new SessionMapper()
  ) {}
  async aggregate(payload: {
    user_id: string;
    role: "lawyer" | "client";
    search: string;
    sort: "name" | "date" | "amount" | "created_at";
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
    } else if (sort === "amount") {
      sortStage["amount"] = order === "asc" ? 1 : -1;
    } else if (sort === "date") {
      sortStage["scheduled_date"] = order === "asc" ? 1 : -1;
    } else {
      sortStage["created_at"] = order === "asc" ? 1 : -1;
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
    const newpayload = this.mapper.toPersistence(payload);
    console.log("newpayload :", newpayload);
    const newSessions = new SessionModel(newpayload);
    const savedSession = await newSessions.save();
    return this.mapper.toDomain(savedSession);
  }
  async update(payload: {
    end_time?: Date;
    client_joined_at?: Date;
    client_left_at?: Date;
    lawyer_left_at?: Date;
    end_reason?: string;
    callDuration?: number;
    lawyer_joined_at?: Date;
    start_time?: Date;
    room_id?: string;
    session_id: string;
    status?: Session["status"];
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
    if (payload.client_left_at) {
      update.client_left_at = payload.client_left_at;
    }
    if (payload.lawyer_left_at) {
      update.lawyer_left_at = payload.lawyer_left_at;
    }
    if (payload.end_reason) {
      update.end_reason = payload.end_reason;
    }
    if (payload.callDuration) {
      update.callDuration = payload.callDuration;
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
    update.room_id = payload.room_id;

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

    return sessions ? this.mapper.toDomain(sessions) : null;
  }
  async findById(payload: { session_id: string }): Promise<Session | null> {
    const sessions = await SessionModel.findById(payload.session_id);
    return sessions ? this.mapper.toDomain(sessions) : null;
  }
  async findSessionsAggregate(
    payload: FetchSessionsInputDto
  ): Promise<FetchSessionsOutputtDto> {
    const {
      search,
      limit,
      page,
      sortBy,
      sortOrder,
      status,
      consultation_type,
      user_id,
    } = payload;
    console.log("payload", payload);
    const skip = (page - 1) * limit;
    const order = sortOrder === "asc" ? 1 : -1;

    const matchStage: Record<string, any> = {};
    if (user_id) {
      matchStage["$or"] = [{ client_id: user_id }, { lawyer_id: user_id }];
    }
    if (status && status !== "all") matchStage.status = status;
    if (consultation_type && consultation_type !== "all")
      matchStage.type = consultation_type;

    const matchStage2 = {
      $or: [
        { "clientData.name": { $regex: search, $options: "i" } },
        { "clientData.email": { $regex: search, $options: "i" } },
        { "lawyerData.name": { $regex: search, $options: "i" } },
        { "lawyerData.email": { $regex: search, $options: "i" } },
      ],
    };

    const sortStage: Record<string, any> = (() => {
      switch (sortBy) {
        case "amount":
          return { amount: order };
        case "date":
          return { scheduled_date: order };
        case "client_name":
          return { "clientData.name": order };
        case "lawyer_name":
          return { "lawyerData.name": order };
        default:
          return { scheduled_date: -1 };
      }
    })();

    const projectStage = {
      $project: {
        id: "$_id",
        _id: 0,
        appointment_id: 1,
        lawyer_id: 1,
        client_id: 1,
        scheduled_date: 1,
        scheduled_time: 1,
        duration: 1,
        reason: 1,
        amount: 1,
        type: 1,
        status: 1,
        notes: 1,
        summary: 1,
        follow_up_suggested: 1,
        follow_up_session_id: 1,
        start_time: 1,
        room_id: 1,
        end_time: 1,
        client_joined_at: 1,
        client_left_at: 1,
        lawyer_joined_at: 1,
        lawyer_left_at: 1,
        end_reason: 1,
        callDuration: 1,
        createdAt: 1,
        updatedAt: 1,

        clientData: {
          name: "$clientData.name",
          email: "$clientData.email",
          mobile: "$clientData.mobile",
          user_id: "$clientData.user_id",
          profile_image: "$clientData.profile_image",
          dob: "$clientData.dob",
          gender: "$clientData.gender",
        },

        lawyerData: {
          name: "$lawyerData.name",
          email: "$lawyerData.email",
          mobile: "$lawyerData.mobile",
          user_id: "$lawyerData.user_id",
          profile_image: "$lawyerData.profile_image",
          dob: "$lawyerData.dob",
          gender: "$lawyerData.gender",
        },
      },
    };

    const pipeline: any[] = [
      { $match: matchStage },
      {
        $lookup: {
          from: "users",
          localField: "client_id",
          foreignField: "user_id",
          as: "clientsUserData",
        },
      },
      {
        $unwind: { path: "$clientsUserData", preserveNullAndEmptyArrays: true },
      },
      {
        $lookup: {
          from: "clients",
          localField: "client_id",
          foreignField: "user_id",
          as: "clientsClientData",
        },
      },
      {
        $unwind: {
          path: "$clientsClientData",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $addFields: {
          clientData: {
            $mergeObjects: ["$clientsUserData", "$clientsClientData"],
          },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "lawyer_id",
          foreignField: "user_id",
          as: "lawyersUserData",
        },
      },
      {
        $unwind: { path: "$lawyersUserData", preserveNullAndEmptyArrays: true },
      },
      {
        $lookup: {
          from: "clients",
          localField: "lawyer_id",
          foreignField: "user_id",
          as: "lawyersClientData",
        },
      },
      {
        $unwind: {
          path: "$lawyersClientData",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $addFields: {
          lawyerData: {
            $mergeObjects: ["$lawyersUserData", "$lawyersClientData"],
          },
        },
      },
      projectStage,
    ];

    const [dataResult, countResult] = await Promise.all([
      SessionModel.aggregate([
        ...pipeline,
        { $match: matchStage2 },
        { $sort: sortStage },
        { $skip: skip },
        { $limit: limit },
      ]),
      SessionModel.aggregate([
        ...pipeline,
        { $match: matchStage2 },
        { $count: "total" },
      ]),
    ]);

    const totalCount = countResult[0]?.total || 0;
    const totalPage = Math.ceil(totalCount / limit);

    return {
      data: dataResult,
      totalCount,
      currentPage: page,
      totalPage,
    };
  }
}
