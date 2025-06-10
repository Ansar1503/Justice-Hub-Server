import { Appointment } from "../../domain/entities/Appointment.entity";
import { lawyer } from "../../domain/entities/Lawyer.entity";
import {
  Availability,
  BlockedSchedule,
  Daytype,
  OverrideDate,
  OverrideSlots,
  ScheduleSettings,
  TimeSlot,
} from "../../domain/entities/Schedule.entity";
import { IAppointmentsRepository } from "../../domain/I_repository/I_Appointments.repo";
import { IClientRepository } from "../../domain/I_repository/I_client.repo";
import { IDocumentsRepository } from "../../domain/I_repository/I_documents.repo";
import { ILawyerRepository } from "../../domain/I_repository/I_lawyer.repo";
import { IScheduleRepo } from "../../domain/I_repository/I_schedule.repo";
import { ISessionsRepo } from "../../domain/I_repository/I_sessions.repo";
import { IUserRepository } from "../../domain/I_repository/I_user.repo";
import { STATUS_CODES } from "../../infrastructure/constant/status.codes";
import { Ilawyerusecase } from "./I_usecases/I_lawyer.usecase";

export class LawyerUsecase implements Ilawyerusecase {
  constructor(
    private userRepo: IUserRepository,
    private clientRepo: IClientRepository,
    private lawyerRepo: ILawyerRepository,
    private scheduleRepo: IScheduleRepo,
    private documentsRepo: IDocumentsRepository,
    private appointRepo: IAppointmentsRepository,
    private sessionsRepo: ISessionsRepo
  ) {}
  timeStringToDate(baseDate: Date, hhmm: string): Date {
    const [h, m] = hhmm.split(":").map(Number);
    const d = new Date(baseDate);
    d.setHours(h, m, 0, 0);
    return d;
  }
  timeStringToMinutes(time: string): number {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
  }

  minutesToTimeString(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    const hoursStr = hours.toString().padStart(2, "0");
    const minsStr = mins.toString().padStart(2, "0");

    return `${hoursStr}:${minsStr}`;
  }

  async verifyLawyer(payload: lawyer): Promise<lawyer> {
    const userDetails = await this.userRepo.findByuser_id(payload.user_id);
    if (!userDetails) {
      throw new Error("USER_NOT_FOUND");
    }
    if (userDetails.role !== "lawyer") {
      throw new Error("USER_NOT_LAWYER");
    }
    if (userDetails.is_blocked) {
      throw new Error("USER_BLOCKED");
    }
    const document = await this.documentsRepo.find({
      user_id: userDetails.user_id,
      email: userDetails.email,
    });
    const lawyerVerficationData = await this.lawyerRepo.findUserId(
      userDetails.user_id
    );
    if (lawyerVerficationData && document) {
      throw new Error("VERIFICATION_EXISTS");
    }
    const documents = await this.documentsRepo.create(payload.documents);
    if (!documents) {
      throw new Error("DOCUMENT_NOT_FOUND");
    }
    // console.log("document created", documents);

    const lawyerData = await this.lawyerRepo.update(userDetails.user_id, {
      user_id: userDetails.user_id,
      description: payload.description || "",
      barcouncil_number: payload.barcouncil_number,
      enrollment_certificate_number: payload.enrollment_certificate_number,
      certificate_of_practice_number: payload.certificate_of_practice_number,
      practice_areas: payload.practice_areas,
      specialisation: payload.specialisation,
      verification_status: "requested",
      experience: payload.experience,
      consultation_fee: payload.consultation_fee,
      documents: documents._id as any,
    } as lawyer);
    return lawyerData as lawyer;
  }

  async fetchLawyerData(user_id: string): Promise<lawyer | null> {
    const userDetails = await this.userRepo.findByuser_id(user_id);

    if (!userDetails) {
      throw new Error("USER_NOT_FOUND");
    }
    if (userDetails.role !== "lawyer") {
      throw new Error("UNAUTHORIZED");
    }
    if (userDetails.is_blocked) {
      throw new Error("USER_BLOCKED");
    }
    const lawyerDetails = await this.lawyerRepo.findUserId(user_id);
    if (!lawyerDetails) {
      throw new Error("USER_NOT_FOUND");
    }

    return {
      ...userDetails,
      ...lawyerDetails,
    };
  }

  async updateSlotSettings(
    payload: ScheduleSettings
  ): Promise<ScheduleSettings | null> {
    if (Number(payload.slotDuration) > 120 || Number(payload.slotDuration < 15))
      throw new Error("INVALIDDURATION");
    if (
      Number(payload.maxDaysInAdvance) < 15 ||
      Number(payload.maxDaysInAdvance) > 90
    )
      throw new Error("INVALIDADVANCE");
    const updatedSettings = await this.scheduleRepo.updateScheduleSettings(
      payload
    );
    return updatedSettings || null;
  }

  async fetchSlotSettings(lawyer_id: string): Promise<ScheduleSettings | null> {
    return await this.scheduleRepo.fetchScheduleSettings(lawyer_id);
  }

  async updateAvailableSlot(
    payload: Availability,
    lawyer_id: string
  ): Promise<Availability | null> {
    const settings = await this.scheduleRepo.fetchScheduleSettings(lawyer_id);
    if (!settings) {
      const error: any = new Error(
        "Settings not found, please create settings."
      );
      error.code = STATUS_CODES.NOT_FOUND;
      throw error;
    }

    for (const [day, data] of Object.entries(payload)) {
      if (!data.enabled) continue;

      const slots = data.timeSlots.map((slot) => ({
        ...slot,
        startMin: this.timeStringToMinutes(slot.start),
        endMin: this.timeStringToMinutes(slot.end),
      }));

      for (const slot of slots) {
        if (slot.startMin < 0 || slot.endMin > 1440) {
          const error: any = new Error(
            "Time should be between 00:00 and 23:59."
          );
          error.code = STATUS_CODES.BAD_REQUEST;
          throw error;
        }
        if (slot.startMin >= slot.endMin) {
          const error: any = new Error(
            "Start time should be less than end time."
          );
          error.code = STATUS_CODES.BAD_REQUEST;
          throw error;
        }
        if (Math.abs(slot.startMin - slot.endMin) < settings.slotDuration) {
          const error: any = new Error(
            `Slot duration should be at least ${settings.slotDuration} minutes.`
          );
          error.code = STATUS_CODES.BAD_REQUEST;
          throw error;
        }
      }

      const sorted = slots.sort((a, b) => a.startMin - b.startMin);

      for (let i = 0; i < sorted.length - 1; i++) {
        const current = sorted[i];
        const next = sorted[i + 1];
        if (current.endMin > next.startMin) {
          const error: any = new Error(
            `Time slot ${current.start}-${current.end} overlaps with ${next.start}-${next.end} on ${day}`
          );
          error.code = STATUS_CODES.BAD_REQUEST;
          throw error;
        }
      }
    }
    const updatedAvailability = await this.scheduleRepo.updateAvailbleSlot(
      payload,
      lawyer_id
    );

    return updatedAvailability;
  }
  async fetchAvailableSlots(lawyer_id: string): Promise<Availability | null> {
    const availability = await this.scheduleRepo.findAvailableSlots(lawyer_id);
    return availability;
  }
  async addOverrideSlots(
    payload: OverrideDate[],
    lawyer_id: string
  ): Promise<OverrideSlots | null> {
    payload.forEach((oveerride) => {
      oveerride.date = new Date(
        oveerride.date.getTime() - oveerride.date.getTimezoneOffset() * 60000
      );
    });
    const slotSettings = await this.scheduleRepo.fetchScheduleSettings(
      lawyer_id
    );
    if (!slotSettings) {
      const error: any = new Error(
        "Settings not found, please create settings."
      );
      error.code = STATUS_CODES.NOT_FOUND;
      throw error;
    }
    const map: any = new Map();
    for (const override of payload) {
      if (map.has(override.date)) {
        const error: any = new Error(
          `Duplicate override date found: ${override.date}`
        );
        error.code = STATUS_CODES.BAD_REQUEST;
        throw error;
      } else {
        map.set(override.date);
      }
    }
    map.clear();
    const timeRanges = payload[0].timeRanges;
    if (timeRanges && timeRanges.length > 0) {
      const slots = timeRanges.map((time) => ({
        ...time,
        startMin: this.timeStringToMinutes(time.start),
        endMin: this.timeStringToMinutes(time.end),
      }));

      for (const slot of slots) {
        if (slot.startMin < 0 || slot.endMin > 1440) {
          const error: any = new Error(
            "Time should be between 00:00 and 23:59."
          );
          error.code = STATUS_CODES.BAD_REQUEST;
          throw error;
        }
        if (slot.startMin >= slot.endMin) {
          const error: any = new Error(
            "Start time should be less than end time."
          );
          error.code = STATUS_CODES.BAD_REQUEST;
          throw error;
        }
        if (Math.abs(slot.startMin - slot.endMin) < slotSettings.slotDuration) {
          const error: any = new Error(
            `Slot duration should be at least ${slotSettings.slotDuration} minutes.`
          );
          error.code = STATUS_CODES.BAD_REQUEST;
          throw error;
        }
      }

      const sorted = slots.sort((a, b) => a.startMin - b.startMin);

      for (let i = 0; i < sorted.length - 1; i++) {
        const current = sorted[i];
        const next = sorted[i + 1];
        if (current.endMin > next.startMin) {
          const error: any = new Error(
            `Time slot ${current.start}-${current.end} overlaps with ${next.start}-${next.end}`
          );
          error.code = STATUS_CODES.BAD_REQUEST;
          throw error;
        }
      }
    }

    const updatedOverrideSlots = await this.scheduleRepo.addOverrideSlots(
      payload,
      lawyer_id
    );

    return updatedOverrideSlots;
  }
  async fetchOverrideSlots(lawyer_id: string): Promise<OverrideSlots | null> {
    const existingOverrideSlots = await this.scheduleRepo.fetchOverrideSlots(
      lawyer_id
    );
    return existingOverrideSlots;
  }
  async removeOverrideSlots(
    lawyer_id: string,
    id: string
  ): Promise<OverrideSlots | null> {
    const existingOverrideSlots = await this.scheduleRepo.fetchOverrideSlots(
      lawyer_id
    );
    if (!existingOverrideSlots) {
      const error: any = new Error("Override slots not found");
      error.code = STATUS_CODES.NOT_FOUND;
      throw error;
    }
    if (existingOverrideSlots.overrideDates.length === 0) {
      const error: any = new Error("No override slots available");
      error.code = STATUS_CODES.NOT_FOUND;
      throw error;
    }
    if (
      existingOverrideSlots.overrideDates.find(
        (override) => override?._id?.toString() === id
      ) === undefined
    ) {
      const error: any = new Error("Override slot not found");
      error.code = STATUS_CODES.NOT_FOUND;
      throw error;
    }
    const updatedOverrideSlots = await this.scheduleRepo.removeOverrideSlots(
      lawyer_id,
      id
    );
    return updatedOverrideSlots;
  }
  async fetchAppointmentDetailsforLawyers(payload: {
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
    return await this.appointRepo.findForLawyersUsingAggregation(payload);
  }
  async rejectClientAppointmen(payload: {
    id: string;
    status: "confirmed" | "pending" | "completed" | "cancelled" | "rejected";
  }): Promise<Appointment | null> {
    const appointment = await this.appointRepo.findById(payload.id);
    if (!appointment) {
      const error: any = new Error("appointment not found");
      error.code = STATUS_CODES.BAD_REQUEST;
      throw error;
    }
    if (appointment.status === "cancelled") {
      const error: any = new Error("already rejected");
      error.code = STATUS_CODES.BAD_REQUEST;
      throw error;
    }
    if (appointment.status === "completed") {
      const error: any = new Error("appointment completed");
      error.code = STATUS_CODES.BAD_REQUEST;
      throw error;
    }
    if (appointment.status === "rejected") {
      const error: any = new Error("appointment already rejected by lawyer");
      error.code = STATUS_CODES.BAD_REQUEST;
      throw error;
    }
    const slotDateTime = this.timeStringToDate(
      appointment.date,
      appointment.time
    );

    if (slotDateTime <= new Date()) {
      const error: any = new Error("Date and time has reached or exceeded");
      error.code = STATUS_CODES.BAD_REQUEST;
      throw error;
    }

    const response = await this.appointRepo.updateWithId(payload);
    return response;
  }
  async confirmClientAppointment(payload: {
    id: string;
    status: "confirmed" | "pending" | "completed" | "cancelled" | "rejected";
  }): Promise<Appointment | null> {
    const appointment = await this.appointRepo.findById(payload.id);
    if (!appointment) {
      const error: any = new Error("appointment not found");
      error.code = STATUS_CODES.BAD_REQUEST;
      throw error;
    }
    if (appointment.status === "cancelled") {
      const error: any = new Error("already rejected");
      error.code = STATUS_CODES.BAD_REQUEST;
      throw error;
    }
    if (appointment.status === "completed") {
      const error: any = new Error("appointment completed");
      error.code = STATUS_CODES.BAD_REQUEST;
      throw error;
    }
    if (appointment.status === "rejected") {
      const error: any = new Error("appointment already rejected by lawyer");
      error.code = STATUS_CODES.BAD_REQUEST;
      throw error;
    }
    const slotDateTime = this.timeStringToDate(
      appointment.date,
      appointment.time
    );

    if (slotDateTime <= new Date()) {
      const error: any = new Error("Date and time has reached or exceeded");
      error.code = STATUS_CODES.BAD_REQUEST;
      throw error;
    }

    await this.sessionsRepo.create({
      amount: appointment.amount,
      appointment_id: payload.id,
      client_id: appointment.client_id,
      duration: appointment.duration,
      lawyer_id: appointment.lawyer_id,
      reason: appointment.reason,
      scheduled_at: appointment.date,
      status: "upcoming",
      type: appointment.type,
    });

    const response = await this.appointRepo.updateWithId(payload);
    return response;
  }
}
