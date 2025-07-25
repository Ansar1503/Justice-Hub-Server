import mongoose from "mongoose";
import { Appointment } from "../../../domain/entities/Appointment.entity";
import { IAppointmentsRepository } from "../../../domain/I_repository/I_Appointments.repo";
import { AppointmentModel } from "../model/appointments.model";
import { User } from "../../../domain/entities/User.entity";
import { Client } from "../../../domain/entities/Client.entity";

export class AppointmentsRepository implements IAppointmentsRepository {
  async createWithTransaction(payload: Appointment): Promise<Appointment> {
    const inputDate = payload.date;
    const startOfDay = new Date(inputDate);
    startOfDay.setUTCHours(0, 0, 0, 0);
    const endOfDay = new Date(inputDate);
    endOfDay.setUTCHours(23, 59, 59, 999);

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

      const newAppointment = new AppointmentModel(payload);
      await newAppointment.save({ session });

      await session.commitTransaction();
      return newAppointment;
    } catch (error) {
      await session.abortTransaction();
    } finally {
      session.endSession();
    }
    const error: any = new Error("Failed to create appointment");
    error.code = 500;
    throw error;
  }

  async findByDateandLawyer_id(payload: {
    lawyer_id: string;
    date: Date;
  }): Promise<Appointment[] | null> {
    const startOfDay = new Date(payload.date).setUTCHours(0, 0, 0, 0);
    const endOfDay = new Date(payload.date).setUTCHours(23, 59, 59, 999);
    return await AppointmentModel.find({
      lawyer_id: payload.lawyer_id,
      date: { $gte: startOfDay, $lte: endOfDay },
    });
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
      }
    );
    return updated;
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
    return afterDelete;
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
  async updateWithId(payload: {
    id: string;
    status: "confirmed" | "pending" | "completed" | "cancelled" | "rejected";
  }): Promise<Appointment | null> {
    return await AppointmentModel.findOneAndUpdate(
      { _id: payload.id },
      { $set: { status: payload.status } },
      { new: true }
    );
  }
  async findById(id: string): Promise<Appointment | null> {
    return await AppointmentModel.findOne({ _id: id });
  }
  async findAllAggregate(payload: {
    search: string;
    limit: number;
    page: number;
    sortBy: "date" | "amount" | "lawyer_name" | "client_name";
    sortOrder: "asc" | "desc";
    status:
      | "pending"
      | "confirmed"
      | "completed"
      | "cancelled"
      | "rejected"
      | "all";
    type: "consultation" | "follow-up" | "all";
  }): Promise<{
    data: (Appointment & { clientData: Client; lawyerData: Client }[]) | [];
    totalCount: number;
    currentPage: number;
    totalPage: number;
  }> {
    const { search, limit, page, sortBy, sortOrder, status, type } = payload;
    const skip = (page - 1) * limit;
    const order = sortOrder === "asc" ? 1 : -1;
    const matchStage: Record<string, any> = {};
    if (status && status !== "all") {
      matchStage["status"] = status;
    }
    if (type && type !== "all") {
      matchStage["type"] = type;
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
      case "amount":
        sortStage[sortBy] = order;
      case "date":
        sortStage[sortBy] = order;
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
          clientsUserData: 0,
          clientsClientData: 0,
          lawyersUserData: 0,
          lawyersClientData: 0,
          "clientData.password": 0,
          "lawyerData.password": 0,
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
      data: dataResult as
        | (Appointment & { clientData: Client; lawyerData: Client }[])
        | [],
      totalCount,
      currentPage: page,
      totalPage,
    };
  }
  async findByClientID(client: string): Promise<Appointment[] | []> {
    return AppointmentModel.find({ client_id: client });
  }
}
