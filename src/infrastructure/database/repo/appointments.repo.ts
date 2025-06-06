import mongoose from "mongoose";
import { Appointment } from "../../../domain/entities/Appointment.entity";
import { IAppointmentsRepository } from "../../../domain/I_repository/I_Appointments.repo";
import { AppointmentModel } from "../model/appointments.model";

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

  async findByDate(payload: {
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
        date: payload.date,
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
}
