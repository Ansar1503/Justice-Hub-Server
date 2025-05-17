import { lawyer } from "../../domain/entities/Lawyer.entity";
import {
  BlockedSchedule,
  Daytype,
  ReccuringSchedule,
  ScheduleSettings,
  TimeSlot,
} from "../../domain/entities/Schedule.entity";
import { IClientRepository } from "../../domain/I_repository/I_client.repo";
import { IDocumentsRepository } from "../../domain/I_repository/I_documents.repo";
import { ILawyerRepository } from "../../domain/I_repository/I_lawyer.repo";
import { IScheduleRepo } from "../../domain/I_repository/I_schedule.repo";
import { IUserRepository } from "../../domain/I_repository/I_user.repo";
import { ERRORS } from "../../infrastructure/constant/errors";
import { Ilawyerusecase } from "./I_usecases/I_lawyer.usecase";

export class LawyerUsecase implements Ilawyerusecase {
  constructor(
    private userRepo: IUserRepository,
    private clientRepo: IClientRepository,
    private lawyerRepo: ILawyerRepository,
    private scheduleRepo: IScheduleRepo,
    private documentsRepo: IDocumentsRepository
  ) {}
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
  async addBlockedSchedule(payload: BlockedSchedule): Promise<void> {
    const user = await this.userRepo.findByuser_id(payload.lawyer_id);
    if (!user) {
      throw new Error("USER_NOT_FOUND");
    }
    if (user.is_blocked) {
      throw new Error("USER_BLOCKED");
    }
    const lawyer = await this.lawyerRepo.findUserId(payload.lawyer_id);
    if (!lawyer) {
      throw new Error("LAWYER_NOT_FOUND");
    }
    if (lawyer.verification_status !== "verified") {
      throw new Error("LAWYER_UNVERIFIED");
    }
    const existingAvailableSlot = await this.scheduleRepo.findAvailableTimeSlot(
      lawyer.user_id,
      payload.date
    );
    // console.log("payloaddate", payload.date);
    // console.log("existinav", existingAvailableSlot);
    if (existingAvailableSlot?.date) throw new Error("AVAILABLESLOTEXIST");
    const existingBlock = await this.scheduleRepo.findBlockedSchedule(
      lawyer.user_id,
      payload.date
    );

    if (existingBlock) {
      throw new Error("BLOCK_EXIST");
    }

    await this.scheduleRepo.createBlockedSchedule(payload);
  }
  async fetchAllBlockedSchedule(
    lawyer_id: string
  ): Promise<BlockedSchedule[] | []> {
    const user = await this.userRepo.findByuser_id(lawyer_id);
    if (!user) throw new Error("LAWYERNOTFOUND");
    if (user.is_blocked) throw new Error("LAWYERBLOCKED");
    const lawyer = await this.lawyerRepo.findUserId(lawyer_id);
    if (!lawyer) throw new Error("LAWYERNOTFOUND");
    if (lawyer.verification_status !== "verified")
      throw new Error("LAWYERUNVERIFIED");
    return await this.scheduleRepo.findAllBlockedSchedule(lawyer_id);
  }
  async removeBlockedSchedule(id: string): Promise<void> {
    await this.scheduleRepo.deleteBlockedSchedule(id);
  }
  async addRecurringSchedule({
    lawyer_id,
    day,
  }: {
    lawyer_id: string;
    day: Daytype;
  }): Promise<void> {
    const user = await this.userRepo.findByuser_id(lawyer_id);
    if (!user) throw new Error("USERNOTFOUND");
    if (user.is_blocked) throw new Error("USERBLOCKED");
    const lawyer = await this.lawyerRepo.findUserId(lawyer_id);
    if (!lawyer) throw new Error("USERNOTFOUND");
    if (lawyer.verification_status !== "verified")
      throw new Error("USERUNVERIFIED");
    const existSettings = await this.scheduleRepo.fetchScheduleSettings(
      lawyer_id
    );
    if (!existSettings) throw new Error("NOSETTINGS");
    const existingslot = await this.scheduleRepo.findRecurringSchedule(
      lawyer_id,
      day
    );
    // console.log("existingSlot", existingslot);
    if (existingslot) throw new Error("SLOTEXIST");
    await this.scheduleRepo.addRecurringShedule({ lawyer_id, day });
  }
  async fetchAllRecurringSlot(
    lawyer_id: string
  ): Promise<ReccuringSchedule | null> {
    const user = await this.userRepo.findByuser_id(lawyer_id);
    if (!user) throw new Error("USERNOTFOUND");
    if (user.is_blocked) throw new Error("USERBLOCKED");
    const lawyer = await this.lawyerRepo.findUserId(lawyer_id);
    if (!lawyer) throw new Error("USERNOTFOUND");
    if (lawyer.verification_status !== "verified")
      throw new Error("USERUNVERIFIED");
    return await this.scheduleRepo.findRecurringSchedule(lawyer_id);
  }

  async removeRecurringSlot(lawyer_id: string, day: Daytype): Promise<void> {
    const user = await this.userRepo.findByuser_id(lawyer_id);
    if (!user) throw new Error("USERNOTFOUND");
    if (user.is_blocked) throw new Error("USERBLOCKED");
    const lawyer = await this.lawyerRepo.findUserId(lawyer_id);
    if (!lawyer) throw new Error("USERNOTFOUND");
    if (lawyer.verification_status !== "verified")
      throw new Error("USERUNVERIFIED");
    await this.scheduleRepo.removeRecurringSchedule(lawyer_id, day);
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

  async updateRecurringSlot(payload: {
    day: Daytype;
    lawyer_id: string;
    startTime?: string;
    endTime?: string;
    active?: boolean;
  }): Promise<void> {
    const user = await this.userRepo.findByuser_id(payload.lawyer_id);
    if (!user) throw new Error("USERNOTFOUND");
    if (user.is_blocked) throw new Error("USERBLOCKED");
    const lawyer = await this.lawyerRepo.findUserId(payload.lawyer_id);
    if (!lawyer) throw new Error("USERNOTFOUND");
    if (lawyer.verification_status !== "verified")
      throw new Error("USERUNVERIFIED");
    const existSettings = await this.scheduleRepo.fetchScheduleSettings(
      lawyer.user_id
    );
    if (!existSettings) throw new Error("SLOTSETTINGNOTEXIS");
    const recring = await this.scheduleRepo.findRecurringSchedule(
      payload.lawyer_id,
      payload.day
    );
    if (!recring) throw new Error("SLOTNOTEXIST");
    if (recring) {
      if (payload.startTime && recring.schedule?.length) {
        const schedule = recring.schedule.filter(
          (schedule) => schedule.day === payload.day
        )[0];

        const startMinutes = this.timeStringToMinutes(payload.startTime);
        const endMinutes = this.timeStringToMinutes(schedule.endTime);

        if (startMinutes >= endMinutes) {
          throw new Error("STARTENDCONFLICT");
        }
        if (
          Math.abs(startMinutes - endMinutes) <
          existSettings.slotDuration + (existSettings?.bufferTime || 0)
        ) {
          throw new Error("DURATION_NOT_ENOUGH");
        }
      }

      if (payload.endTime && recring.schedule?.length) {
        const schedule = recring.schedule.filter(
          (schedule) => schedule.day === payload.day
        )[0];
        const endMinutes = this.timeStringToMinutes(payload.endTime);
        const startMinutes = this.timeStringToMinutes(schedule.startTime);
        if (
          Math.abs(startMinutes - endMinutes) <
          existSettings.slotDuration + (existSettings?.bufferTime || 0)
        ) {
          throw new Error("DURATION_NOT_ENOUGH");
        }
        if (endMinutes <= startMinutes) {
          throw new Error("STARTENDCONFLICT");
        }
      }
    }
    await this.scheduleRepo.updateRecurringSchedule({
      day: payload.day,
      lawyer_id: payload.lawyer_id,
      active: payload?.active,
      endTime: payload?.endTime,
      startTime: payload?.startTime,
    });
  }
  async updateSlotSettings(payload: ScheduleSettings): Promise<void> {
    const user = await this.userRepo.findByuser_id(payload.lawyer_id);
    if (!user) throw new Error("USERNOTFOUND");
    if (user.is_blocked) throw new Error("USERBLOCKED");
    const lawyer = await this.lawyerRepo.findUserId(payload.lawyer_id);
    if (!lawyer) throw new Error("USERNOTFOUND");
    if (lawyer.verification_status !== "verified")
      throw new Error("USERUNVERIFIED");
    if (Number(payload.bufferTime) > 60 || Number(payload.bufferTime) < 0)
      throw new Error("INVALIDBUFFER");
    if (Number(payload.slotDuration) > 120 || Number(payload.slotDuration < 15))
      throw new Error("INVALIDDURATION");
    if (
      Number(payload.maxDaysInAdvance) < 7 ||
      Number(payload.maxDaysInAdvance) > 90
    )
      throw new Error("INVALIDADVANCE");
    await this.scheduleRepo.updateScheduleSettings(payload);
  }
  async fetchSlotSettings(lawyer_id: string): Promise<ScheduleSettings | null> {
    return await this.scheduleRepo.fetchScheduleSettings(lawyer_id);
  }
  async addAvailableSlots(lawyer_id: string, date: string): Promise<void> {
    const user = await this.userRepo.findByuser_id(lawyer_id);
    if (!user) throw new Error(ERRORS.USER_NOT_FOUND);
    if (user.is_blocked) throw new Error(ERRORS.USER_BLOCKED);
    const lawyer = await this.lawyerRepo.findUserId(lawyer_id);
    if (!lawyer) throw new Error(ERRORS.USER_NOT_FOUND);
    if (lawyer.verification_status !== "verified")
      throw new Error(ERRORS.LAWYER_NOT_VERIFIED);
    const blockedSlot = await this.scheduleRepo.findBlockedSchedule(
      lawyer_id,
      date
    );
    if (blockedSlot?.date) throw new Error("SLOTBLOCKED");
    const slotSettings = await this.scheduleRepo.fetchScheduleSettings(
      lawyer_id
    );
    if (!slotSettings) throw new Error("SLOTSETTINGSNOTEXIST");

    const days: Daytype[] = [
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
    ];
    const index = new Date(
      new Date(date).getTime() +
        Math.abs(new Date(date).getTimezoneOffset() * 60000)
    ).getDay();
    const day = days[index];

    const recurringSlots = await this.scheduleRepo.findRecurringSchedule(
      lawyer_id,
      day
    );
    if (recurringSlots) {
      const reschedule = recurringSlots?.schedule?.filter(
        (slot) => slot.day == day
      )[0];
      if (!reschedule?.active) throw new Error("RECURRINGINACTIVE");
    }

    if (!recurringSlots) throw new Error("NORECURRING");

    let startTime: string;
    let endTime: string;

    const schedule = recurringSlots.schedule.filter(
      (slot) => slot.day === day
    )[0];
    if (!schedule.active) throw new Error("NOTACTIVE");
    const availableslots = await this.scheduleRepo.findAvailableTimeSlot(
      lawyer_id,
      date
    );
    if (!availableslots?.date) {
      startTime = schedule.startTime;
      const minutes = this.timeStringToMinutes(startTime);
      endTime = this.minutesToTimeString(minutes + slotSettings.slotDuration);
      if (endTime > schedule.endTime) throw new Error("TIMEEXCEEDED");
      await this.scheduleRepo.addAvailableTimeSlot({
        date,
        lawyer_id,
        startTime,
        endTime,
      });
    } else if (
      availableslots.timeSlots &&
      availableslots.timeSlots.length > 0
    ) {
      const lastTime =
        availableslots.timeSlots[availableslots.timeSlots.length - 1].endTime;
      const minutes =
        this.timeStringToMinutes(lastTime) + (slotSettings?.bufferTime || 0);
      startTime = this.minutesToTimeString(minutes);
      endTime = this.minutesToTimeString(minutes + slotSettings.slotDuration);
      if (endTime > schedule.endTime) throw new Error("TIMEEXCEEDED");
      await this.scheduleRepo.addAvailableTimeSlot({
        date,
        lawyer_id,
        startTime,
        endTime,
      });
    }
  }

  async fetchAvailableSlot(
    lawyer_id: string,
    date: string
  ): Promise<TimeSlot | null> {
    const user = await this.userRepo.findByuser_id(lawyer_id);
    if (!user) throw new Error(ERRORS.USER_NOT_FOUND);
    if (user.is_blocked) throw new Error(ERRORS.USER_BLOCKED);
    const lawyer = await this.lawyerRepo.findUserId(lawyer_id);
    if (!lawyer) throw new Error(ERRORS.USER_NOT_FOUND);
    if (lawyer.verification_status !== "verified")
      throw new Error(ERRORS.LAWYER_NOT_VERIFIED);
    const timeSlots = await this.scheduleRepo.findAvailableTimeSlot(
      lawyer_id,
      date
    );
    return timeSlots;
  }

  async removeOneAvailableSlot(payload: {
    lawyer_id: string;
    date: string;
    startTime: string;
    endTime: string;
  }): Promise<void> {
    const user = await this.userRepo.findByuser_id(payload.lawyer_id);
    if (!user) throw new Error(ERRORS.USER_NOT_FOUND);
    if (user.is_blocked) throw new Error(ERRORS.USER_BLOCKED);
    const lawyer = await this.lawyerRepo.findUserId(payload.lawyer_id);
    if (!lawyer) throw new Error(ERRORS.USER_NOT_FOUND);
    if (lawyer.verification_status !== "verified")
      throw new Error(ERRORS.LAWYER_NOT_VERIFIED);
    await this.scheduleRepo.removeOneAvailableSlot(payload);
    const updatedDoc = await this.scheduleRepo.findAvailableTimeSlot(
      payload.lawyer_id,
      payload.date
    );

    if (updatedDoc && updatedDoc.timeSlots.length === 0) {
      await this.scheduleRepo.removeAllAvailableSlots(
        payload.lawyer_id,
        payload.date
      );
    }
  }

  async updateAvailableSlot(payload: {
    lawyer_id: string;
    prev: { date: string; startTime: string; endTime: string };
    update: { key: "startTime" | "endTime"; value: string };
  }): Promise<void> {
    const user = await this.userRepo.findByuser_id(payload.lawyer_id);
    if (!user) throw new Error(ERRORS.USER_NOT_FOUND);
    if (user.is_blocked) throw new Error(ERRORS.USER_BLOCKED);
    const lawyer = await this.lawyerRepo.findUserId(payload.lawyer_id);
    if (!lawyer) throw new Error(ERRORS.USER_NOT_FOUND);
    if (lawyer.verification_status !== "verified")
      throw new Error(ERRORS.LAWYER_NOT_VERIFIED);
    const settings = await this.scheduleRepo.fetchScheduleSettings(
      lawyer.user_id
    );
    if (!settings) throw new Error("NOSETTINGS");
    const existingAvailableSlot = await this.scheduleRepo.findAvailableTimeSlot(
      payload.lawyer_id,
      payload.prev.date
    );
    if (!existingAvailableSlot) throw new Error("NOAVAILABLESLOT");
    let slotExist = false;
    for (let i = 0; i < existingAvailableSlot.timeSlots.length; i++) {
      if (
        existingAvailableSlot.timeSlots[i].startTime ==
          payload.prev.startTime &&
        existingAvailableSlot.timeSlots[i].endTime == payload.prev.endTime
      ) {
        slotExist = true;
      }
    }
    if (!slotExist) throw new Error("NOAVAILABLESLOT");
    const days: Daytype[] = [
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
    ];
    const index = new Date(payload.prev.date).getDay();
    const day = days[index];
    const recurringSlot = await this.scheduleRepo.findRecurringSchedule(
      payload.lawyer_id,
      day
    );

    if (!recurringSlot) throw new Error("NORECURRING");
    const schedule = recurringSlot.schedule.filter(
      (slot) => slot.day === day
    )[0];
    if (!schedule.active) throw new Error("NORECURRING");
    const updateMinutes = this.timeStringToMinutes(payload.update.value);
    const existingStrartMinutes = this.timeStringToMinutes(schedule.startTime);
    const existingEndMinutes = this.timeStringToMinutes(schedule.endTime);
    // console.log("update minutes :", updateMinutes);
    // console.log("existing start minutes :", existingStrartMinutes);
    // console.log("existing end minutes :", existingEndMinutes);
    if (payload.update.key === "startTime") {
      if (updateMinutes < existingStrartMinutes) {
        throw new Error("RECURRINGSTART");
      }
      if (
        Math.abs(updateMinutes - existingEndMinutes) != settings.slotDuration
      ) {
        throw new Error("SLOTDURATIONMAX");
      }
    }
    if (payload.update.key === "endTime") {
      if (updateMinutes > existingEndMinutes) {
        throw new Error("RECURRINGEND");
      }
    }
  }
  async fetchAvailableSlotsByWeek(
    lawyer_id: string,
    weekStart: Date
  ): Promise<{ slots: TimeSlot[] | []; blocks: BlockedSchedule[] | [] }> {
    const user = await this.userRepo.findByuser_id(lawyer_id);
    if (!user) throw new Error(ERRORS.USER_NOT_FOUND);
    if (user.is_blocked) throw new Error(ERRORS.USER_BLOCKED);
    const lawyer = await this.lawyerRepo.findUserId(lawyer_id);
    if (!lawyer) throw new Error(ERRORS.USER_NOT_FOUND);
    if (lawyer.verification_status !== "verified")
      throw new Error(ERRORS.LAWYER_NOT_VERIFIED);
    const startOfWeek = new Date(
      weekStart.getTime() + Math.abs(weekStart.getTimezoneOffset() * 60000)
    );
    const endOfWeek = new Date(
      startOfWeek.getFullYear(),
      startOfWeek.getMonth(),
      startOfWeek.getDate() + 7
    );
    // console.log("start", startOfWeek);
    // console.log("end", endOfWeek);
    const slots = await this.scheduleRepo.fetchAvailableSlotsByWeek({
      lawyer_id,
      startWeek: startOfWeek,
      endWeek: endOfWeek,
    });

    const blocks = await this.scheduleRepo.fetchBlockedScheduleByWeek(
      lawyer_id,
      startOfWeek,
      endOfWeek
    );
    return { slots, blocks };
  }
}
