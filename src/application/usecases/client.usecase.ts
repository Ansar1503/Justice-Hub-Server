import { ClientDto, ClientUpdateDto } from "../dtos/client.dto";
import { IUserRepository } from "../../domain/IRepository/IUserRepo";
import { IClientRepository } from "../../domain/IRepository/I_client.repo";
import { ResposeUserDto } from "../dtos/user.dto";
import { sendVerificationEmail } from "../services/email.service";
import bcrypt from "bcrypt";
import { Address } from "../../domain/entities/Address.entity";
import { IAddressRepository } from "../../domain/IRepository/I_address.repo";
import { ILawyerRepository } from "../../domain/IRepository/ILawyer.repo";
import { I_clientUsecase } from "./I_usecases/I_clientusecase";
// import { LawyerFilterParams } from "../../domain/entities/Lawyer";
import { LawyerResponseDto } from "../dtos/lawyer.dto";
import { Review } from "../../domain/entities/Review.entity";
import { IreviewRepo } from "../../domain/IRepository/I_review.repo";
import {
  TimeSlot,
  Daytype,
  ScheduleSettings,
} from "../../domain/entities/Schedule.entity";
import { ERRORS } from "../../infrastructure/constant/errors";
import { IScheduleRepo } from "../../domain/IRepository/I_schedule.repo";
import {
  getSessionDetails,
  getSessionMetaData,
  getStripeSession,
  handleStripeWebHook,
} from "../services/stripe.service";
import { IAppointmentsRepository } from "../../domain/IRepository/I_Appointments.repo";
import { STATUS_CODES } from "../../infrastructure/constant/status.codes";
import { Appointment } from "../../domain/entities/Appointment.entity";
import { ISessionsRepo } from "../../domain/IRepository/I_sessions.repo";
import { Session, SessionDocument } from "../../domain/entities/Session.entity";
import { ValidationError } from "../../interfaces/middelwares/Error/CustomError";
import { ICloudinaryService } from "../services/cloudinary.service";
import { IDisputes } from "../../domain/IRepository/IDisputes";
import { IChatRepo } from "../../domain/IRepository/IChatRepo";
import { createToken } from "../services/ZegoCloud.service";
import { ICallLogs } from "../../domain/IRepository/ICallLogs";
import { CallLogs } from "../../domain/entities/CallLogs";

export class ClientUseCase implements I_clientUsecase {
  constructor(
    private userRepository: IUserRepository,
    private clientRepository: IClientRepository,
    private addressRepository: IAddressRepository,
    private lawyerRepository: ILawyerRepository,
    private reviewRepository: IreviewRepo,
    private scheduleRepo: IScheduleRepo,
    private appointmentRepo: IAppointmentsRepository,
    private sessionRepo: ISessionsRepo,
    private cloudinaryService: ICloudinaryService,
    private disputesRepo: IDisputes,
    private chatRepo: IChatRepo,
    private callRepo: ICallLogs
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
  generateTimeSlots(start: string, end: string, duration: number): string[] {
    const slots: string[] = [];

    const [startHour, startMinute] = start.split(":").map(Number);
    const [endHour, endMinute] = end.split(":").map(Number);

    const startDate = new Date();
    startDate.setHours(startHour, startMinute, 0, 0);

    const endDate = new Date();
    endDate.setHours(endHour, endMinute, 0, 0);

    const current = new Date(startDate);

    while (current < endDate) {
      const hours = String(current.getHours()).padStart(2, "0");
      const minutes = String(current.getMinutes()).padStart(2, "0");
      slots.push(`${hours}:${minutes}`);
      current.setMinutes(current.getMinutes() + duration);
    }

    return slots;
  }

  async fetchClientData(user_id: string): Promise<any> {
    try {
      const userDetails = await this.userRepository.findByuser_id(user_id);
      if (!userDetails) {
        throw new Error("USER_NOT_FOUND");
      }
      const clientdetails = await this.clientRepository.findByUserId(user_id);
      const addressDetails = await this.addressRepository.find(user_id);
      const lawyerData = await this.lawyerRepository.findUserId(user_id);
      let lawyerVerfication;
      if (userDetails.role === "lawyer") {
        lawyerVerfication = lawyerData?.verification_status;
      }

      if (!clientdetails) {
        throw new Error("CLIENT_NOT_FOUND");
      }
      const address = {
        city: addressDetails?.city || "",
        locality: addressDetails?.locality || "",
        state: addressDetails?.state || "",
        pincode: addressDetails?.pincode || "",
      };
      const responseClientData = new ClientUpdateDto({
        email: userDetails.email || "",
        mobile: userDetails.mobile || "",
        name: userDetails.name || "",
        role: userDetails.role,
        user_id: user_id,
        address: clientdetails.address || "",
        dob: clientdetails.dob || "",
        gender: clientdetails.gender || "",
        profile_image: clientdetails.profile_image || "",
        is_blocked: userDetails.is_blocked,
        is_verified: userDetails.is_verified,
      });

      return {
        ...responseClientData,
        address,
        lawyerVerfication,
      };
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async updateClientData(
    clientData: ClientDto & { name: string; mobile: string }
  ): Promise<ClientUpdateDto> {
    try {
      const userDetails = await this.userRepository.findByuser_id(
        clientData.user_id
      );
      if (!userDetails) {
        throw new Error("USER_NOT_FOUND");
      }
      const clientDetails = await this.clientRepository.findByUserId(
        clientData.user_id
      );

      const updateData = new ClientUpdateDto({
        email: userDetails.email,
        mobile: clientData?.mobile || userDetails.mobile || "",
        name: clientData.name || userDetails.name || "",
        role: userDetails.role,
        user_id: userDetails.user_id,
        address: clientData.address || clientDetails?.address || "",
        dob: clientData.dob || clientDetails?.dob || "",
        gender: clientData.gender || clientDetails?.gender || "",
        profile_image:
          clientData.profile_image || clientDetails?.profile_image || "",
      });
      // console.log("updated client Data", updateData);
      await this.userRepository.update(updateData);
      await this.clientRepository.update(updateData);
      // while(true){}
      return updateData;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async changeEmail(email: string, user_id: string): Promise<ResposeUserDto> {
    try {
      const userDetails = await this.userRepository.findByuser_id(user_id);
      if (!userDetails) {
        throw new Error("NO_USER_FOUND");
      }
      const userExist = await this.userRepository.findByEmail(email);
      if (userExist?.email) {
        throw new Error("EMAIL_ALREADY_EXIST");
      }
      // console.log("email", email);
      await this.userRepository.update({
        email: email,
        user_id,
        is_verified:false
      });
      // console.log("email updated");
      try {
        await sendVerificationEmail(email, user_id, "");
      } catch (error) {
        throw new Error("MAIL_SEND_ERROR");
      }
      return new ResposeUserDto({
        email: email,
        name: userDetails.name,
        role: userDetails.role,
        user_id: userDetails.user_id,
      });
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async verifyMail(email: string, user_id: string): Promise<void> {
    try {
      await sendVerificationEmail(email, user_id, "");
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async updatePassword(payload: {
    currentPassword: string;
    user_id: string;
    password: string;
  }): Promise<ClientUpdateDto> {
    const userDetails = await this.userRepository.findByuser_id(
      payload.user_id
    );
    const clientDetails = await this.clientRepository.findByUserId(
      payload.user_id
    );

    if (!userDetails) {
      throw new Error("USER_NOT_FOUND");
    }
    if (userDetails.is_blocked) {
      throw new Error("USER_BLOCKED");
    }

    const currpassmatch = await bcrypt.compare(
      payload.currentPassword,
      userDetails.password
    );

    if (!currpassmatch) {
      throw new Error("PASS_NOT_MATCH");
    }

    const passmatch = await bcrypt.compare(
      payload.password,
      userDetails.password
    );

    if (passmatch) {
      throw new Error("PASS_EXIST");
    }

    const newpass = await bcrypt.hash(payload.password, 10);

    const updateData = new ClientUpdateDto({
      email: userDetails.email,
      mobile: userDetails.mobile || "",
      name: userDetails.name,
      role: userDetails.role,
      user_id: payload.user_id,
      password: newpass,
      address: clientDetails?.address,
      dob: clientDetails?.dob,
      gender: clientDetails?.gender,
      is_blocked: userDetails.is_blocked,
      is_verified: userDetails.is_verified,
      profile_image: clientDetails?.profile_image,
    });

    await this.userRepository.update(updateData);
    return updateData;
  }

  async updateAddress(payload: Address & { user_id: string }): Promise<void> {
    const userDetails = await this.userRepository.findByuser_id(
      payload.user_id
    );
    const clientDetails = await this.clientRepository.findByUserId(
      payload.user_id
    );
    if (!userDetails) {
      throw new Error("USER_NOT_FOUND");
    }

    if (userDetails.is_blocked) {
      throw new Error("USER_BLOCKED");
    }

    const updatedAddress = await this.addressRepository.update(payload);
    const updateData = new ClientUpdateDto({
      email: userDetails.email,
      mobile: userDetails.mobile || "",
      name: userDetails.name,
      role: userDetails.role,
      user_id: payload.user_id,
      address: updatedAddress._id,
      profile_image: clientDetails?.profile_image || "",
      dob: clientDetails?.dob || "",
      gender: clientDetails?.gender || "",
    });
    await this.clientRepository.update(updateData);
  }

  async getLawyers(filter: any): Promise<{
    data: any[];
    totalCount: number;
    currentPage: number;
    totalPages: number;
  }> {
    const {
      search,
      practiceAreas,
      specialisation,
      experienceMin,
      experienceMax,
      feeMin,
      feeMax,
      sortBy,
      page,
      limit,
    } = filter;

    const matchStage: any = {
      experience: { $gte: experienceMin, $lte: experienceMax },
      consultation_fee: { $gte: feeMin, $lte: feeMax },
      verification_status: "verified",
    };

    if (practiceAreas) {
      matchStage.practice_areas = {
        $in: Array.isArray(practiceAreas) ? practiceAreas : [practiceAreas],
      };
    }

    if (specialisation) {
      matchStage.specialisation = {
        $in: Array.isArray(specialisation) ? specialisation : [specialisation],
      };
    }

    const sortStage: any = {};
    switch (sortBy) {
      case "experience":
        sortStage.experience = -1;
        break;
      case "rating":
        sortStage.rating = -1;
        break;
      case "fee-low":
        sortStage.consultation_fee = 1;
        break;
      case "fee-high":
        sortStage.consultation_fee = -1;
        break;
      default:
        sortStage.createdAt = -1;
    }
    // console.log("match:", matchStage);
    // console.log("sortStage:", sortStage);
    // console.log("search:", search);
    // console.log("page:", page);
    // console.log("limit:", limit);
    const response = await this.lawyerRepository.findAllLawyersWithQuery({
      matchStage,
      sortStage,
      search,
      page,
      limit,
    });
    // console.log("response:", response);
    const lawyers = response?.data?.map(
      (lawyer: any) =>
        new LawyerResponseDto(
          lawyer.user_id,
          lawyer.user.name,
          lawyer.user.email,
          lawyer.user.is_blocked,
          lawyer.user.createdAt,
          lawyer.user?.mobile,
          lawyer.user.role,
          lawyer.client?.profile_image,
          lawyer.client?.dob,
          lawyer.client?.gender,
          {
            city: lawyer?.address?.city,
            locality: lawyer?.address?.locality,
            pincode: lawyer?.address?.pincode,
            state: lawyer?.address?.state,
          },
          lawyer.barcouncil_number,
          lawyer.verification_status,
          lawyer.practice_areas,
          lawyer.experience,
          lawyer.specialisation,
          lawyer.consultation_fee
        )
    );
    return {
      ...response,
      data: lawyers,
    };
  }

  async getLawyer(user_id: string): Promise<LawyerResponseDto | null> {
    const user = await this.userRepository.findByuser_id(user_id);
    if (!user) throw new Error("USER_NOT_FOUND");
    if (user.is_blocked) throw new Error("USER_BLOCKED");
    const client = await this.clientRepository.findByUserId(user_id);
    const address = await this.addressRepository.find(user_id);
    const lawyer = await this.lawyerRepository.findUserId(user_id);
    if (!lawyer) throw new Error("LAWYER_UNAVAILABLE");
    if (lawyer.verification_status !== "verified")
      throw new Error("LAWYER_UNVERIFIED");
    const responseData: LawyerResponseDto = {
      createdAt: user.createdAt as Date,
      email: user.email,
      is_blocked: user.is_blocked as boolean,
      mobile: user.mobile || "",
      name: user.name,
      role: user.role,
      user_id,
      Address: {
        city: address?.city,
        locality: address?.city,
        pincode: address?.pincode,
        state: address?.state,
      },
      barcouncil_number: lawyer.barcouncil_number,
      consultation_fee: lawyer.consultation_fee,
      dob: client?.dob,
      experience: lawyer.experience,
      gender: client?.gender as "male" | "female" | "others",
      practice_areas: lawyer.practice_areas,
      profile_image: client?.profile_image,
      specialisation: lawyer.specialisation,
      verification_status: lawyer.verification_status,
      description: lawyer.description || "",
      certificate_of_practice_number:
        lawyer.certificate_of_practice_number || "",
      enrollment_certificate_number: lawyer.enrollment_certificate_number || "",
    };
    return responseData;
  }
  async addreview(payload: Review): Promise<void> {
    // console.log(payload);
    const user = await this.userRepository.findByuser_id(payload.client_id);
    if (!user) throw new Error("USER_EMPTY");
    if (!user.is_verified) throw new Error("USER_UNVERIFIED");
    if (user.is_blocked) throw new Error("USER_BLOCKED");
    const lawyer = await this.lawyerRepository.findUserId(payload.lawyer_id);
    if (!lawyer) throw new Error("LAWYER_EMPTY");
    if (lawyer.verification_status !== "verified")
      throw new Error("LAWYER_UNVERIFIED");

    const existingReview = await this.reviewRepository.findBySession_id(
      payload.session_id
    );
    // console.log(existingReview);
    if (existingReview && existingReview.length > 5) {
      throw new Error("REVIEW_LIMIT_EXCEEDED");
    }

    try {
      await this.reviewRepository.create(payload);
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
  async fetchLawyerSlotSettings(
    lawyer_id: string
  ): Promise<ScheduleSettings | null> {
    const slotSettings = await this.scheduleRepo.fetchScheduleSettings(
      lawyer_id
    );
    return slotSettings;
  }
  async fetchLawyerSlots({
    lawyer_id,
    date,
    client_id,
  }: {
    lawyer_id: string;
    date: Date;
    client_id: string;
  }): Promise<any> {
    const isToday = (someDate: Date) => {
      const today = new Date();
      return (
        someDate.getDate() === today.getDate() &&
        someDate.getMonth() === today.getMonth() &&
        someDate.getFullYear() === today.getFullYear()
      );
    };

    const isSlotInFuture = (slotTime: string) => {
      const now = new Date();
      const [hours, minutes] = slotTime.split(":").map(Number);
      const slotDate = new Date(date);
      slotDate.setHours(hours, minutes, 0, 0);

      return slotDate > now;
    };

    const filterBookedSlots = (slots: string[]) =>
      slots.filter((t) => !booked.has(t));
    const user = await this.userRepository.findByuser_id(lawyer_id);
    if (!user) throw new Error(ERRORS.USER_NOT_FOUND);
    if (user.is_blocked) throw new Error(ERRORS.USER_BLOCKED);
    const lawyer = await this.lawyerRepository.findUserId(lawyer_id);
    if (!lawyer) throw new Error(ERRORS.USER_NOT_FOUND);
    if (lawyer.verification_status !== "verified")
      throw new Error(ERRORS.LAWYER_NOT_VERIFIED);

    const slotSettings = await this.scheduleRepo.fetchScheduleSettings(
      lawyer_id
    );

    if (!slotSettings) {
      const error: any = new Error("slot settings not found for the lawyer");
      error.code = 404;
      throw error;
    }
    const existingAppointment =
      await this.appointmentRepo.findByDateandLawyer_id({
        date,
        lawyer_id,
      });

    const booked = new Set<string>();
    existingAppointment?.forEach(
      (a) => a.payment_status !== "failed" && booked.add(a.time)
    );

    const slotDuration = slotSettings.slotDuration;

    const override = await this.scheduleRepo.fetcghOverrideSlotByDate(
      lawyer_id,
      date
    );

    const availableSlots = await this.scheduleRepo.findAvailableSlots(
      lawyer_id
    );

    if (!availableSlots) {
      const error: any = new Error("No available slots found for the lawyer");
      error.code = 404;
      throw error;
    }

    const days: Daytype[] = [
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
    ];

    const index = date.getDay();
    const day = days[index];

    if (!availableSlots[day]) {
      const error: any = new Error(
        "No available slots found for the selected date"
      );
      error.code = 404;
      throw error;
    }

    if (override && override.overrideDates.length > 0) {
      const overrideSlot = override.overrideDates[0];
      if (overrideSlot.isUnavailable) {
        return {
          slots: [],
          isAvailable: false,
        };
      }
      if (overrideSlot.timeRanges && overrideSlot.timeRanges.length > 0) {
        let allSlots = [];
        for (let i = 0; i < overrideSlot.timeRanges.length; i++) {
          const timeRange = overrideSlot.timeRanges[i];
          const timeSlot = this.generateTimeSlots(
            timeRange.start,
            timeRange.end,
            slotDuration
          );
          allSlots.push(...timeSlot);
        }
        allSlots = filterBookedSlots(allSlots);

        if (isToday(date)) {
          allSlots = allSlots.filter(isSlotInFuture);
        }

        return {
          slots: allSlots,
          isAvailable: allSlots.length > 0,
        };
      }
    }
    // console.log("day", day);
    // console.log("availbalie", availableSlots[day]);
    if (!availableSlots[day].enabled) {
      return {
        slots: [],
        isAvailable: false,
      };
    }
    let daySlots: string[] = [];
    for (const range of availableSlots[day].timeSlots) {
      daySlots.push(
        ...this.generateTimeSlots(range.start, range.end, slotDuration)
      );
    }
    daySlots = filterBookedSlots(daySlots);

    if (isToday(date)) {
      daySlots = daySlots.filter(isSlotInFuture);
    }

    return {
      slots: daySlots,
      isAvailable: daySlots.length > 0,
    };
  }

  async createCheckoutSession(
    client_id: string,
    lawyer_id: string,
    date: Date,
    timeSlot: string,
    duration: number,
    reason: string
  ): Promise<any> {
    // const client = await this.clientRepository.findByUserId(lawyer_id);
    const user = await this.userRepository.findByuser_id(lawyer_id);
    if (!user) throw new Error(ERRORS.USER_NOT_FOUND);
    if (user.is_blocked) throw new Error(ERRORS.USER_BLOCKED);
    const lawyer = await this.lawyerRepository.findUserId(lawyer_id);
    if (!lawyer) throw new Error(ERRORS.USER_NOT_FOUND);
    if (lawyer.verification_status !== "verified")
      throw new Error(ERRORS.LAWYER_NOT_VERIFIED);
    const slotDateTime = this.timeStringToDate(date, timeSlot);
    if (slotDateTime <= new Date()) {
      const err: any = new Error("Selected time slot is in the past");
      err.code = STATUS_CODES.BAD_REQUEST;
      throw err;
    }
    const existingAppointment = await this.appointmentRepo.findByClientID(
      client_id
    );
    if (existingAppointment) {
      const filtered = existingAppointment.filter((app) => app.date);
    }
    const slotSettings = await this.scheduleRepo.fetchScheduleSettings(
      lawyer_id
    );
    if (!slotSettings) {
      const error: any = new Error("slot settings not found for the lawyer");
      error.code = 404;
      throw error;
    }
    const availableSlots = await this.scheduleRepo.findAvailableSlots(
      lawyer_id
    );
    if (!availableSlots) {
      const error: any = new Error("No available slots found for the lawyer");
      error.code = 404;
      throw error;
    }
    const override = await this.scheduleRepo.fetcghOverrideSlotByDate(
      lawyer_id,
      date
    );
    const appointment = await this.appointmentRepo.findByDateandLawyer_id({
      lawyer_id,
      date,
    });
    const timeSlotExist = appointment?.some(
      (appointment) =>
        appointment.time === timeSlot && appointment.payment_status !== "failed"
    );
    if (timeSlotExist) {
      const error: any = new Error("slot already booked");
      error.code = 404;
      throw error;
    }
    const existingApointmentonDate =
      await this.appointmentRepo.findByDateandClientId({ client_id, date });
    const bookingExist = existingApointmentonDate?.some(
      (appointment) =>
        appointment.time === timeSlot && appointment.payment_status !== "failed"
    );
    if (bookingExist) {
      const error: any = new Error("booking exist on same time");
      error.code = STATUS_CODES.BAD_REQUEST;
      throw error;
    }
    if (override && Object.keys(override).length > 0) {
      const overrideDate = override.overrideDates[0];
      if (overrideDate.isUnavailable) {
        const error: any = new Error("lawyer is unavailble for the date");
        error.code = 404;
        throw error;
      }
      if (!overrideDate.timeRanges || overrideDate.timeRanges.length === 0) {
        const error: any = new Error("No slots found for the date");
        error.code = 404;
        throw error;
      }
      if (overrideDate.timeRanges.length > 0) {
        const timeRanges = overrideDate.timeRanges;
        const bookTimeMins = this.timeStringToMinutes(timeSlot);
        if (isNaN(bookTimeMins)) {
          const error: any = new Error("Invalid time slot format");
          error.code = 400;
          throw error;
        }
        const isValidTime = timeRanges.some((range) => {
          const startMins = this.timeStringToMinutes(range.start);
          const endMins = this.timeStringToMinutes(range.end);
          if (isNaN(startMins) || isNaN(endMins)) {
            return false;
          }
          return bookTimeMins >= startMins && bookTimeMins <= endMins;
        });
        if (!isValidTime) {
          const error: any = new Error(
            "Time slots are not valid for the selected time slot"
          );
          error.code = 404;
          throw error;
        }
        await this.appointmentRepo.createWithTransaction({
          client_id,
          date,
          duration,
          amount: lawyer.consultation_fee,
          lawyer_id,
          payment_status: "pending",
          reason,
          status: "pending",
          time: timeSlot,
          type: "consultation",
        });
        const stripe = await getStripeSession({
          amount: lawyer.consultation_fee,
          date: String(date),
          lawyer_name: user.name,
          slot: timeSlot,
          userEmail: user.email,
          lawyer_id,
          duration,
          client_id,
        });
        return stripe;
      }
    }

    const days: Daytype[] = [
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
    ];
    const index = date.getDay();
    const day = days[index];
    if (!availableSlots[day]) {
      const error: any = new Error(
        "No available slots found for the selected date"
      );
      error.code = 404;
      throw error;
    }
    if (!availableSlots[day].enabled) {
      const error: any = new Error(
        "Slots are not available for the selected date"
      );
      error.code = 404;
      throw error;
    }
    const timeSlots: TimeSlot[] = availableSlots[day].timeSlots;
    if (!timeSlots || timeSlots.length === 0) {
      const error: any = new Error(
        "Slots are not available for the selected date"
      );
      error.code = 404;
      throw error;
    }

    const bookTimeMins = this.timeStringToMinutes(timeSlot);
    const isValidTime = timeSlots.some((range) => {
      const startMins = this.timeStringToMinutes(range.start);
      const endMins = this.timeStringToMinutes(range.end);
      if (isNaN(startMins) || isNaN(endMins)) {
        return false;
      }
      return bookTimeMins >= startMins && bookTimeMins <= endMins;
    });

    if (!isValidTime) {
      const error: any = new Error("Invalid time slot");
      error.code = 404;
      throw error;
    }
    await this.appointmentRepo.createWithTransaction({
      client_id,
      date,
      duration,
      lawyer_id,
      amount: lawyer.consultation_fee,
      payment_status: "pending",
      reason,
      status: "pending",
      time: timeSlot,
      type: "consultation",
    });

    const stripe = await getStripeSession({
      amount: lawyer.consultation_fee,
      date: String(date),
      lawyer_name: user.name,
      slot: timeSlot,
      userEmail: user.email,
      lawyer_id,
      duration,
      client_id,
    });
    return stripe;
  }

  async handleStripeHook(
    body: any,
    signature: string | string[]
  ): Promise<any> {
    const result = await handleStripeWebHook(body, signature);
    if (!result.eventHandled) return;

    const { lawyer_id, client_id, date, time, duration, payment_status } =
      result;
    if (
      !client_id ||
      !lawyer_id ||
      !date ||
      !time ||
      !duration ||
      !payment_status
    ) {
      throw new Error("no metadata found");
    }
    const scheduleSettings = await this.scheduleRepo.fetchScheduleSettings(
      lawyer_id
    );
    let status:
      | "confirmed"
      | "pending"
      | "completed"
      | "cancelled"
      | "rejected" = "pending";
    if (scheduleSettings && scheduleSettings.autoConfirm) {
      status = "confirmed";
    }
    await this.appointmentRepo.Update({
      lawyer_id,
      client_id,
      date: new Date(String(date)),
      time,
      duration: Number(duration),
      payment_status,
      status,
    });
  }

  async getSessionMetadata(sessionid: string): Promise<any> {
    const metadata = await getSessionMetaData(sessionid);
    const { client_id, date, duration, lawyer_id, time } = metadata;
    if (!client_id || !date || !duration || !lawyer_id || !time) {
      const error: any = new Error("metatdata not found");
      error.code = 404;
      throw error;
    }
    return await this.appointmentRepo.delete({
      client_id,
      date: new Date(date),
      duration: Number(duration),
      time,
      lawyer_id,
    });
  }

  async fetchStripeSessionDetails(id: string): Promise<any> {
    const sessionDetails = await getSessionDetails(id);
    return {
      lawyer: sessionDetails?.metadata?.lawyer_name,
      slot: sessionDetails?.metadata?.time,
      date: sessionDetails?.metadata?.date,
      amount: sessionDetails?.metadata?.amount,
    };
  }
  async fetchAppointmentDetails(payload: {
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
    return await this.appointmentRepo.findForClientsUsingAggregation(payload);
  }

  async cancellAppointment(payload: {
    id: string;
    status: "confirmed" | "pending" | "completed" | "cancelled" | "rejected";
  }): Promise<Appointment | null> {
    const appointment = await this.appointmentRepo.findById(payload.id);
    if (!appointment) {
      const error: any = new Error("appointment not found");
      error.code = STATUS_CODES.BAD_REQUEST;
      throw error;
    }
    if (appointment.status === "cancelled") {
      const error: any = new Error("already cancelled");
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
    if (appointment.status === "confirmed") {
      const error: any = new Error("appointment already confirmed");
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
    const response = await this.appointmentRepo.updateWithId(payload);
    return response;
  }
  async fetchSessions(payload: {
    user_id: string;
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
    return await this.sessionRepo.aggregate({ ...payload, role: "client" });
  }

  async cancelSession(payload: {
    session_id: string;
  }): Promise<Session | null> {
    const Existingsession = await this.sessionRepo.findById({
      session_id: payload.session_id,
    });
    if (!Existingsession) throw new ValidationError("Session not found");
    switch (Existingsession.status) {
      case "cancelled":
        throw new ValidationError("Session has already been cancelled");
      case "completed":
        throw new ValidationError("Session has already been completed");
      case "missed":
        throw new ValidationError("Session has been missed");
    }
    const sessionStartAt = this.timeStringToDate(
      Existingsession.scheduled_date,
      Existingsession.scheduled_time
    );
    const currentDate = new Date();
    if (sessionStartAt > currentDate) {
      throw new ValidationError("Session has already started!");
    }
    const session = await this.sessionRepo.update({
      session_id: payload.session_id,
      status: "cancelled",
    });
    return session;
  }

  async endSession(payload: { sessionId: string }): Promise<Session | null> {
    const session = await this.sessionRepo.findById({
      session_id: payload.sessionId,
    });
    if (!session) throw new ValidationError("Session not found");
    switch (session.status) {
      case "cancelled":
        throw new ValidationError("Session has been cancelled");
      case "completed":
        throw new ValidationError("Session has been completed");
      case "missed":
        throw new ValidationError("Session has been missed");
      case "upcoming":
        throw new ValidationError("session has not started yet");
    }
    const sessionStartAt = this.timeStringToDate(
      session.scheduled_date,
      session.scheduled_time
    );
    const currentDate = new Date();
    // if (currentDate < sessionStartAt) {
    //   throw new ValidationError("Session has not started yet");
    // }
    const durationInMinutes = session.start_time
      ? Math.floor(
          (currentDate.getTime() - session.start_time.getTime()) / (1000 * 60)
        )
      : 0;

    const updatedSession = await this.sessionRepo.update({
      session_id: payload.sessionId,
      room_id: "",
      client_left_at: currentDate,
      status: "completed",
      callDuration: durationInMinutes,
      end_time: currentDate,
      end_reason: "session completed",
    });
    await this.callRepo.updateByRoomId({
      roomId: session.room_id,
      session_id: payload.sessionId,
      client_left_at: currentDate,
      status: "completed",
      callDuration: durationInMinutes,
      end_time: currentDate,
      end_reason: "session completed",
    });
    return updatedSession;
  }

  async uploadNewDocument(payload: {
    sessionId: string;
    document: { name: string; type: string; url: string }[];
  }): Promise<SessionDocument | null> {
    const session = await this.sessionRepo.findById({
      session_id: payload.sessionId,
    });
    const SessionDocument = await this.sessionRepo.findDocumentBySessionId({
      session_id: payload.sessionId,
    });
    if (SessionDocument) {
      if (SessionDocument.document.length > 0) {
        throw new ValidationError(
          "Session is already has document. remove existing document and upload new "
        );
      }
    }

    if (!session) {
      throw new ValidationError("Session not found");
    }
    switch (session.status) {
      case "cancelled":
        throw new ValidationError("Session is cancelled");
      case "completed":
        throw new ValidationError("Session is completed");
      case "missed":
        throw new ValidationError("Session is missed");
      case "ongoing":
        throw new ValidationError("Session is ongoing");
      default:
        break;
    }
    const slotDateTime = this.timeStringToDate(
      session.scheduled_date,
      session.scheduled_time
    );
    if (slotDateTime <= new Date()) {
      throw new ValidationError("Session is already begun");
    }
    const newDocument = await this.sessionRepo.createDocument({
      client_id: session.client_id,
      session_id: session.id as string,
      document: payload.document,
    });
    return newDocument;
  }
  async findExistingSessionDocument(
    sessionId: string
  ): Promise<SessionDocument | null> {
    return await this.sessionRepo.findDocumentBySessionId({
      session_id: sessionId,
    });
  }

  async removeSessionDocument(payload: {
    documentId: string;
    sessionId: string;
  }): Promise<SessionDocument | null> {
    const existingDoc = await this.sessionRepo.findDocumentBySessionId({
      session_id: payload.sessionId,
    });
    if (!existingDoc) {
      throw new ValidationError("Session not found");
    }

    const urltoDelete = existingDoc?.document?.filter(
      (doc) => doc?._id == payload.documentId
    )[0].url;

    this.cloudinaryService.deleteFile(urltoDelete);

    const deleted = await this.sessionRepo.removeDocument(payload.documentId);
    // console.log("deleted", deleted);
    if (!deleted?.document?.length) {
      // console.log("working....");
      await this.sessionRepo.removeAllDocuments(deleted?.id || "");
      return null;
    }
    return deleted;
  }

  async fetchReviews(payload: {
    lawyer_id: string;
    page: number;
  }): Promise<{ data: Review[]; nextCursor?: number }> {
    const reviews = await this.reviewRepository.findByLawyer_id(payload);
    return reviews;
  }
  async fetchReviewsBySession(payload: {
    session_id: string;
  }): Promise<
    (Review & { reviewedBy: { name: string; profile_image: string } })[] | []
  > {
    const session = await this.sessionRepo.findById(payload);
    if (!session) throw new ValidationError("Session not found");
    const reviews = await this.reviewRepository.findBySession_id(
      payload.session_id
    );
    return reviews;
  }

  async updateReviews(payload: {
    review_id: string;
    updates: Partial<Review>;
  }): Promise<Review | null> {
    const review = await this.reviewRepository.findByReview_id(
      payload.review_id
    );
    if (!review) throw new ValidationError("review not found");
    const updated = await this.reviewRepository.update(payload);
    return updated;
  }
  async deleteReview(payload: { review_id: string }): Promise<Review | null> {
    const deletingReview = await this.reviewRepository.findByReview_id(
      payload.review_id
    );
    if (!deletingReview) throw new ValidationError("review not found");
    await this.reviewRepository.delete(payload.review_id);
    return deletingReview;
  }
  async reportReview(payload: {
    review_id: string;
    reason: string;
    reportedBy: string;
    reportedUser: string;
  }): Promise<void> {
    const review = await this.reviewRepository.findByReview_id(
      payload.review_id
    );
    if (!review) throw new ValidationError("review not found");

    const exists = await this.disputesRepo.findByContentId({
      contentId: payload.review_id,
    });

    if (exists && Object.keys(exists).length > 0)
      throw new ValidationError("content already reported");

    const newReported = await this.disputesRepo.create({
      contentId: payload.review_id,
      disputeType: "reviews",
      reason: payload.reason,
      status: "pending",
      reportedBy: payload.reportedBy,
      reportedUser: payload.reportedUser,
    });
  }
  async joinSession(payload: {
    sessionId: string;
  }): Promise<Session & { zc: { appId: number; token: string } }> {
    const existingSession = await this.sessionRepo.findById({
      session_id: payload.sessionId,
    });
    if (!existingSession) throw new ValidationError("session not found");
    switch (existingSession.status) {
      case "cancelled":
        throw new ValidationError("Session is cancelled");
      case "completed":
        throw new ValidationError("Session is completed");
      case "missed":
        throw new ValidationError("Session is missed");
      default:
        break;
    }
    const slotDateTime = this.timeStringToDate(
      existingSession.scheduled_date,
      existingSession.scheduled_time
    );
    const newDate = new Date();
    // if (newDate < slotDateTime) {
    //   throw new ValidationError("Scheduled time is not reached");
    // }
    slotDateTime.setMinutes(
      slotDateTime.getMinutes() + existingSession.duration + 5
    );
    // if (newDate > slotDateTime)
    //   throw new ValidationError("session time is over");
    const { appId, token } = await createToken({
      userId: existingSession.client_id,
      roomId: existingSession.room_id,
      expiry: existingSession?.duration * 60,
    });

    const session = await this.sessionRepo.update({
      client_joined_at: newDate,
      session_id: payload.sessionId,
    });
    return {
      ...(session as Session),
      zc: { appId, token },
    };
  }
  async fetchCallLogs(payload: {
    sessionId: string;
    limit: number;
    page: number;
  }): Promise<{
    data: CallLogs[] | [];
    totalCount: number;
    currentPage: number;
    totalPages: number;
  }> {
    return await this.callRepo.findBySessionId(payload);
  }
}
