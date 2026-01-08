import mongoose, { ClientSession } from "mongoose";
import { AppointmentMapper } from "@infrastructure/Mapper/Implementations/AppointmentMapper";
import {
  appointmentOutputDto,
  FetchAppointmentsInputDto,
  FetchAppointmentsOutputDto,
} from "@src/application/dtos/Appointments/FetchAppointmentsDto";
import { Appointment } from "../../../domain/entities/Appointment";
import { IAppointmentsRepository } from "../../../domain/IRepository/IAppointmentsRepo";
import {
  AppointmentModel,
  IAppointmentModel,
} from "../model/AppointmentsModel";
// import {
//   FetchAppointmentsInputDto,
//   FetchAppointmentsOutputDto,
// } from "@src/application/dtos/Admin/FetchAppointmentsDto";
import { BaseRepository } from "./base/BaseRepo";

export class AppointmentsRepository
  extends BaseRepository<Appointment, IAppointmentModel>
  implements IAppointmentsRepository
{
  constructor(session?: ClientSession) {
    super(AppointmentModel, new AppointmentMapper(), session);
  }
  async createWithTransaction(payload: Appointment): Promise<Appointment> {
    const inputDate = payload.date;
    const startOfDay = new Date(inputDate);
    startOfDay.setUTCHours(0, 0, 0, 0);
    const endOfDay = new Date(inputDate);
    endOfDay.setUTCHours(23, 59, 59, 999);
    console.log("inputdate",inputDate)
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const existing = await AppointmentModel.findOne({
        lawyer_id: payload.lawyer_id,
        date: { $gte: startOfDay, $lte: endOfDay },
        time: payload.time,
      }).session(session);
      if (existing) {
        const error: any = new Error("Slot already booked");
        error.code = 409;
        throw error;
      }
      const newAppointment = new AppointmentModel(
        this.mapper.toPersistence(payload)
      );
      await newAppointment.save({ session });
      await session.commitTransaction();
      return this.mapper.toDomain(newAppointment);
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  async findByDateandLawyer_id(payload: {
    lawyer_id: string;
    date: Date;
  }): Promise<Appointment[] | null> {
    const startOfDay = new Date(payload.date).setUTCHours(0, 0, 0, 0);
    const endOfDay = new Date(payload.date).setUTCHours(23, 59, 59, 999);
    const data = await AppointmentModel.find({
      lawyer_id: payload.lawyer_id,
      date: { $gte: startOfDay, $lte: endOfDay },
    });
    return this.mapper.toDomainArray && data
      ? this.mapper.toDomainArray(data)
      : null;
  }
  async findByDateandClientId(payload: {
    client_id: string;
    date: Date;
  }): Promise<Appointment[] | null> {
    const startOfDay = new Date(payload.date).setUTCHours(0, 0, 0, 0);
    const endOfDay = new Date(payload.date).setUTCHours(23, 59, 59, 999);
    return await AppointmentModel.find({
      client_id: payload.client_id,
      date: { $gte: startOfDay, $lte: endOfDay },
    });
  }
  async Update(payload: Partial<Appointment>): Promise<Appointment | null> {
    if (!payload.date) {
      return null;
    }
    const startOfDay = new Date(payload?.date).setUTCHours(0, 0, 0, 0);
    const endOfDay = new Date(payload?.date).setUTCHours(23, 59, 59, 999);
    const updated = await AppointmentModel.findOneAndUpdate(
      {
        client_id: payload.client_id,
        lawyer_id: payload.lawyer_id,
        date: { $gte: startOfDay, $lte: endOfDay },
        time: payload.time,
        duration: payload.duration,
      },
      {
        $set: {
          payment_status: payload.payment_status,
          status: payload.status,
        },
      },
      {
        new: true,
      }
    );
    return updated ? this.mapper.toDomain(updated) : null;
  }
  async delete(payload: Partial<Appointment>): Promise<Appointment | null> {
    if (!payload.date) {
      return null;
    }
    const startOfDay = new Date(payload?.date).setUTCHours(0, 0, 0, 0);
    const endOfDay = new Date(payload?.date).setUTCHours(23, 59, 59, 999);
    const afterDelete = await AppointmentModel.findOneAndDelete({
      client_id: payload.client_id,
      lawyer_id: payload.lawyer_id,
      date: { $gte: startOfDay, $lte: endOfDay },
      time: payload.time,
      duration: payload.duration,
    });
    return afterDelete ? this.mapper.toDomain(afterDelete) : null;
  }
  async findForClientsUsingAggregation(payload: {
    client_id: string;
    search: string;
    appointmentStatus:
      | "all"
      | "confirmed"
      | "pending"
      | "completed"
      | "cancelled"
      | "rejected";
    appointmentType: "all" | "consultation" | "follow-up";
    sortField: "name" | "date" | "consultation_fee" | "created_at";
    sortOrder: "asc" | "desc";
    page: number;
    limit: number;
  }): Promise<{
    data: any;
    totalCount: number;
    currentPage: number;
    totalPage: number;
  }> {
    const {
      client_id,
      search = "",
      appointmentStatus = "all",
      appointmentType = "all",
      sortField = "name",
      sortOrder = "desc",
      page = 1,
      limit = 10,
    } = payload;
    const matchStage: Record<string, any> = { client_id };
    const sortStage: Record<string, any> = {
      [sortField]: sortOrder === "asc" ? 1 : -1,
    };
    if (sortField == "name") {
      sortStage["userData.name"] = sortOrder === "asc" ? 1 : -1;
    } else if (sortField === "consultation_fee") {
      sortStage["lawyerData.consultation_fee"] = sortOrder === "asc" ? 1 : -1;
    }
    const matchStage2: Record<string, any> = {};
    if (appointmentStatus && appointmentStatus !== "all") {
      matchStage["status"] = appointmentStatus;
    }
    if (appointmentType && appointmentType !== "all") {
      matchStage["type"] = appointmentType;
    }
    const countPipeline: any[] = [{ $match: matchStage }];
    const dataPipeline: any[] = [{ $match: matchStage }];
    const lookups = [
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
          localField: "lawyer_id",
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
    ];

    matchStage2["$or"] = [
      { "userData.name": { $regex: search, $options: "i" } },
      { "userData.email": { $regex: search, $options: "i" } },
    ];

    dataPipeline.push(
      ...lookups,
      { $match: matchStage2 },
      { $project: { "userData.password": 0, "lawyerData.documents": 0 } },
      { $sort: sortStage },
      { $skip: (page - 1) * limit },
      { $limit: limit }
    );

    countPipeline.push(...lookups, { $count: "total" });
    const [dataResult, countResult] = await Promise.all([
      AppointmentModel.aggregate(dataPipeline),
      AppointmentModel.aggregate(countPipeline),
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
  async findForLawyersUsingAggregation(payload: {
    lawyer_id: string;
    search: string;
    appointmentStatus:
      | "all"
      | "confirmed"
      | "pending"
      | "completed"
      | "cancelled"
      | "rejected";
    appointmentType: "all" | "consultation" | "follow-up";
    sortField: "name" | "date" | "consultation_fee" | "created_at";
    sortOrder: "asc" | "desc";
    page: number;
    limit: number;
  }): Promise<{
    data: any;
    totalCount: number;
    currentPage: number;
    totalPage: number;
  }> {
    const {
      lawyer_id,
      search = "",
      appointmentStatus = "all",
      appointmentType = "all",
      sortField = "created_at",
      sortOrder = "desc",
      page = 1,
      limit = 10,
    } = payload;
    const matchStage: Record<string, any> = { lawyer_id };
    const sortStage: Record<string, any> = {
      [sortField]: sortOrder === "asc" ? 1 : -1,
    };
    if (sortField == "name") {
      sortStage["userData.name"] = sortOrder === "asc" ? 1 : -1;
    } else if (sortField === "consultation_fee") {
      sortStage["lawyerData.consultation_fee"] = sortOrder === "asc" ? 1 : -1;
    } else if (sortField === "date") {
      sortStage["date"] = sortOrder === "asc" ? 1 : -1;
    } else if (sortField === "created_at") {
      sortStage["created_at"] = sortOrder === "asc" ? 1 : -1;
    }
    const matchStage2: Record<string, any> = {};
    if (appointmentStatus && appointmentStatus !== "all") {
      matchStage["status"] = appointmentStatus;
    }
    if (appointmentType && appointmentType !== "all") {
      matchStage["type"] = appointmentType;
    }
    const countPipeline: any[] = [{ $match: matchStage }];
    const dataPipeline: any[] = [{ $match: matchStage }];
    const lookups = [
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
    ];

    matchStage2["$or"] = [
      { "userData.name": { $regex: search, $options: "i" } },
      { "userData.email": { $regex: search, $options: "i" } },
    ];

    dataPipeline.push(
      ...lookups,
      { $match: matchStage2 },
      { $project: { "userData.password": 0, "lawyerData.documents": 0 } },
      { $sort: sortStage },
      { $skip: (page - 1) * limit },
      { $limit: limit }
    );

    countPipeline.push(...lookups, { $count: "total" });
    const [dataResult, countResult] = await Promise.all([
      AppointmentModel.aggregate(dataPipeline),
      AppointmentModel.aggregate(countPipeline),
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
  async updateWithId(payload: {
    id: string;
    status: "confirmed" | "pending" | "completed" | "cancelled" | "rejected";
  }): Promise<Appointment | null> {
    return await AppointmentModel.findOneAndUpdate(
      { _id: payload.id },
      { $set: { status: payload.status } },
      { new: true, session: this.session }
    );
  }
  async findById(id: string): Promise<Appointment | null> {
    return await AppointmentModel.findOne({ _id: id });
  }
  async findAllAggregate(
    payload: FetchAppointmentsInputDto
  ): Promise<FetchAppointmentsOutputDto> {
    const {
      search,
      limit,
      page,
      sortBy,
      sortOrder,
      appointmentStatus,
      consultationType,
      user_id,
    } = payload;
    const skip = (page - 1) * limit;
    const order = sortOrder === "asc" ? 1 : -1;
    const matchStage: Record<string, any> = {};
    if (user_id) {
      matchStage["$or"] = [{ client_id: user_id }, { lawyer_id: user_id }];
    }
    if (consultationType && consultationType !== "all") {
      matchStage["type"] = consultationType;
    }
    if (appointmentStatus && appointmentStatus !== "all") {
      matchStage["status"] = appointmentStatus;
    }

    const matchStage2: Record<string, any> = {
      $or: [
        { "clientData.name": { $regex: search, $options: "i" } },
        { "clientData.email": { $regex: search, $options: "i" } },
        { "lawyerData.name": { $regex: search, $options: "i" } },
        { "lawyerData.email": { $regex: search, $options: "i" } },
      ],
    };
    const sortStage: Record<string, any> = {};
    switch (sortBy) {
      case "fee":
        sortStage["amount"] = order;
      case "date":
        sortStage["createdAt"] = order;
      case "client_name":
        sortStage["clientData.name"] = order;
      case "lawyer_name":
        sortStage["lawyerData.name"] = order;
    }
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
        $unwind: {
          path: "$clientsUserData",
          preserveNullAndEmptyArrays: true,
        },
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
        $unwind: {
          path: "$lawyersUserData",
          preserveNullAndEmptyArrays: true,
        },
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
      {
        $project: {
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
          id: "$_id",
          caseId: "$caseId",
          lawyer_id: "$lawyer_id",
          client_id: "$client_id",
          bookingId: "$bookingId",
          date: "$date",
          time: "$time",
          duration: "$duration",
          reason: "$reason",
          amount: "$amount",
          payment_status: "$payment_status",
          type: "$type",
          status: "$status",
          createdAt: "$createdAt",
          updatedAt: "$updatedAt",
        },
      },
    ];

    const [dataResult, countResult] = await Promise.all([
      AppointmentModel.aggregate([
        ...pipeline,
        { $match: matchStage2 },
        { $sort: sortStage },
        { $skip: skip },
        { $limit: limit },
      ]),
      AppointmentModel.aggregate([
        ...pipeline,
        { $match: matchStage2 },
        { $sort: sortStage },
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
  async findByClientID(client: string): Promise<Appointment[] | []> {
    const data = await AppointmentModel.find({
      $or: [{ client_id: client }, { lawyer_id: client }],
    });
    return this.mapper.toDomainArray && data
      ? this.mapper.toDomainArray(data)
      : [];
  }
  async findByCaseId(id: string): Promise<appointmentOutputDto[] | []> {
    const data = await this.model.aggregate([
      { $match: { caseId: id } },
      {
        $lookup: {
          from: "users",
          localField: "client_id",
          foreignField: "user_id",
          as: "clientsUserData",
        },
      },
      {
        $unwind: {
          path: "$clientsUserData",
          preserveNullAndEmptyArrays: true,
        },
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
        $unwind: {
          path: "$lawyersUserData",
          preserveNullAndEmptyArrays: true,
        },
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
      {
        $project: {
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
          id: "$_id",
          caseId: "$caseId",
          lawyer_id: "$lawyer_id",
          client_id: "$client_id",
          bookingId: "$bookingId",
          date: "$date",
          time: "$time",
          duration: "$duration",
          reason: "$reason",
          amount: "$amount",
          payment_status: "$payment_status",
          type: "$type",
          status: "$status",
          createdAt: "$createdAt",
          updatedAt: "$updatedAt",
        },
      },
    ]);
    return data;
  }
  async findByBookingId(id: string): Promise<Appointment | null> {
    const data = await this.model.findOne({ bookingId: id });
    return data ? this.mapper.toDomain(data) : null;
  }
  async findAppointmentsByLawyerAndRange(
    lawyer_id: string,
    startDate: Date,
    endDate: Date
  ): Promise<Appointment[]> {
    const data = await this.model.find({
      lawyer_id,
      date: { $gte: startDate, $lte: endDate },
    });
    return data && this.mapper.toDomainArray
      ? this.mapper.toDomainArray(data)
      : [];
  }
}
