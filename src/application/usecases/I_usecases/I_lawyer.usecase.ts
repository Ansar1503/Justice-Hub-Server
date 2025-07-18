import { Appointment } from "../../../domain/entities/Appointment.entity";
import { ChatMessage } from "../../../domain/entities/Chat.entity";
import { lawyer } from "../../../domain/entities/Lawyer.entity";
import {
  Availability,
  OverrideDate,
  OverrideSlots,
  ScheduleSettings,
} from "../../../domain/entities/Schedule.entity";
import {
  Session,
  SessionDocument,
} from "../../../domain/entities/Session.entity";

export interface Ilawyerusecase {
  verifyLawyer(payload: lawyer): Promise<lawyer>;
  fetchLawyerData(user_id: string): Promise<lawyer | null>;
  timeStringToDate(baseDate: Date, hhmm: string): Date;
  timeStringToMinutes(time: string): number;
  timeStringToMinutes(time: string): number;
  updateSlotSettings(
    payload: ScheduleSettings
  ): Promise<ScheduleSettings | null>;
  fetchSlotSettings(lawyer_id: string): Promise<ScheduleSettings | null>;
  updateAvailableSlot(
    payload: Availability,
    lawyer_id: string
  ): Promise<Availability | null>;
  fetchAvailableSlots(lawyer_id: string): Promise<Availability | null>;
  addOverrideSlots(
    payload: OverrideDate[],
    lawyer_id: string
  ): Promise<OverrideSlots | null>;
  fetchOverrideSlots(lawyer_id: string): Promise<OverrideSlots | null>;
  removeOverrideSlots(
    lawyer_id: string,
    id: string
  ): Promise<OverrideSlots | null>;
  fetchAppointmentDetailsforLawyers(payload: {
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
  }>;
  rejectClientAppointmen(payload: {
    id: string;
    status: "confirmed" | "pending" | "completed" | "cancelled" | "rejected";
  }): Promise<Appointment | null>;
  confirmClientAppointment(payload: {
    id: string;
    status: "confirmed" | "pending" | "completed" | "cancelled" | "rejected";
  }): Promise<Appointment | null>;
  cancelSession(payload: { session_id: string }): Promise<Session | null>;
  startSession(payload: { sessionId: string }): Promise<Session | null>;
  findExistingSessionDocument(
    sessionId: string
  ): Promise<SessionDocument | null>;
  endSession(payload: { sessionId: string }): Promise<Session | null>;
  // sendMessageFile(payload: {
  //   sessionId: string;
  //   file: { name: string; url: string; type: string };
  // }): Promise<ChatMessage | null>;
}
