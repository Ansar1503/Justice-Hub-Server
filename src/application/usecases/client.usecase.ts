import { ClientDto, ClientUpdateDto } from "../dtos/client.dto";
import { IUserRepository } from "../../domain/I_repository/I_user.repo";
import { IClientRepository } from "../../domain/I_repository/I_client.repo";
import { ResposeUserDto } from "../dtos/user.dto";
import { sendVerificationEmail } from "../services/email.service";
import bcrypt from "bcrypt";
import { Address } from "../../domain/entities/Address.entity";
import { IAddressRepository } from "../../domain/I_repository/I_address.repo";
import { ILawyerRepository } from "../../domain/I_repository/I_lawyer.repo";
import { I_clientUsecase } from "./I_usecases/I_clientusecase";
import { LawyerFilterParams } from "../../domain/entities/Lawyer.entity";
import { LawyerResponseDto } from "../dtos/lawyer.dto";
import { Review } from "../../domain/entities/Review.entity";
import { IreviewRepo } from "../../domain/I_repository/I_review.repo";
import {
  TimeSlot,
  BlockedSchedule,
  Daytype,
} from "../../domain/entities/Schedule.entity";
import { ERRORS } from "../../infrastructure/constant/errors";
import { IScheduleRepo } from "../../domain/I_repository/I_schedule.repo";
import {
  getSessionDetails,
  getStripeSession,
  handleStripeWebHook,
} from "../services/stripe.service";

export class ClientUseCase implements I_clientUsecase {
  constructor(
    private userRepository: IUserRepository,
    private clientRepository: IClientRepository,
    private addressRepository: IAddressRepository,
    private lawyerRepository: ILawyerRepository,
    private reviewRepository: IreviewRepo,
    private scheduleRepo: IScheduleRepo
  ) {}
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

      await this.userRepository.update({
        email: email || userDetails.email,
        user_id,
        is_blocked: userDetails.is_blocked,
        is_verified: false,
        mobile: userDetails.mobile,
        password: userDetails.password,
        role: userDetails.role,
        name: userDetails.name,
      });
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

  async getLawyers(filter: LawyerFilterParams): Promise<{
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
    const user = await this.userRepository.findByuser_id(payload.client_id);
    if (!user) throw new Error("USER_EMPTY");
    if (!user.is_verified) throw new Error("USER_UNVERIFIED");
    if (user.is_blocked) throw new Error("USER_BLOCKED");
    const lawyer = await this.lawyerRepository.findUserId(payload.lawyer_id);
    if (!lawyer) throw new Error("LAWYER_EMPTY");
    if (lawyer.verification_status !== "verified")
      throw new Error("LAWYER_UNVERIFIED");

    try {
      await this.reviewRepository.create(payload);
      console.log("reaview added");
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async fetchLawyerSlots(lawyer_id: string, date: Date): Promise<any> {
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
    const index = new Date(date).getDay();
    const day = days[index];
    if (!availableSlots[day]) {
      const error: any = new Error(
        "No available slots found for the selected date"
      );
      error.code = 404;
      throw error;
    }
    if (!availableSlots[day].enabled) {
      const error: any = new Error("Lawyer not available on the selected date");
      error.code = 404;
      throw error;
    }

    if (override && override.overrideDates.length > 0) {
      const overrideSlot = override.overrideDates[0];
      // console.log("overrideSlot", overrideSlot);
      if (overrideSlot.isUnavailable) {
        return {
          slots: [],
          isAvailable: false,
        };
      }
      if (overrideSlot.timeRanges && overrideSlot.timeRanges.length > 0) {
        const overrideTimeRanges = overrideSlot.timeRanges[0];
        const lastoverrideTimeRange =
          overrideSlot.timeRanges[overrideSlot.timeRanges.length - 1];
        const allSlots = this.generateTimeSlots(
          overrideTimeRanges.start,
          lastoverrideTimeRange.end,
          slotDuration
        );
        return {
          slots: allSlots,
          isAvailable: true,
        };
      }
    }
    if (!availableSlots[day].enabled) {
      return {
        slots: [],
        isAvailable: false,
      };
    }
    const firstTimeRange = availableSlots[day].timeSlots[0];
    const lastTimeRange =
      availableSlots[day].timeSlots[availableSlots[day].timeSlots.length - 1];
    const allSlots = this.generateTimeSlots(
      firstTimeRange.start,
      lastTimeRange.end,
      slotDuration
    );
    return {
      slots: allSlots,
      isAvailable: true,
    };
  }

  async createCheckoutSession(
    lawyer_id: string,
    date: Date,
    timeSlot: string,
    user_id: string,
    documentlink?: string
  ): Promise<any> {
    const clientUser = await this.userRepository.findByuser_id(user_id);
    if (!clientUser) throw new Error(ERRORS.USER_NOT_FOUND);
    if (clientUser.is_blocked) throw new Error(ERRORS.USER_BLOCKED);
    const client = await this.clientRepository.findByUserId(lawyer_id);
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
    const slotDuration = slotSettings.slotDuration;
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
    if (override && Object.keys(override).length > 0) {
      const overrideDate = override.overrideDates[0];
      const availability = overrideDate.isUnavailable;
      if (availability) {
        const error: any = new Error(
          "Slots are not available for the selected date"
        );
        error.code = 404;
        throw error;
      }
      if (!overrideDate.timeRanges || overrideDate.timeRanges.length === 0) {
        const error: any = new Error(
          "No time ranges found for the override date"
        );
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
            console.warn("Invalid time range:", range);
            return false;
          }
          return bookTimeMins >= startMins && bookTimeMins <= endMins;
        });
        console.log("isValidTime:", isValidTime, "bookTimeMins:", bookTimeMins);
        if (!isValidTime) {
          const error: any = new Error(
            "Time slots are not available for the selected date"
          );
          error.code = 404;
          throw error;
        }
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
        console.warn("Invalid time range:", range);
        return false;
      }
      return bookTimeMins >= startMins && bookTimeMins <= endMins;
    });

    if (!isValidTime) {
      const error: any = new Error(
        "Time slot is not available for the selected date"
      );
      error.code = 404;
      throw error;
    }

    const stripe = await getStripeSession({
      amount: lawyer.consultation_fee,
      date: String(date),
      lawyer_name: user.name,
      profile_image: client?.profile_image || "",
      slot: timeSlot,
      userEmail: user.email,
      lawyer_id,
    });
    return stripe;
  }

  async handleStripeHook(
    body: any,
    signature: string | string[]
  ): Promise<any> {
    await handleStripeWebHook(body, signature);
  }
  async fetchStripeSessionDetails(id: string): Promise<any> {
    const sessionDetails = await getSessionDetails(id);
    console.log("sessionDetails", sessionDetails);
    return {
      lawyer: sessionDetails?.metadata?.lawyer_name,
      slot: sessionDetails?.metadata?.slot,
      date: sessionDetails?.metadata?.date,
      amount: sessionDetails?.metadata?.amount,
    };
  }
}
