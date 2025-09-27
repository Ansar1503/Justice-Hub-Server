import { generateTimeSlots } from "@shared/utils/helpers/DateAndTimeHelper";
import { IUserRepository } from "@domain/IRepository/IUserRepo";
import { ERRORS } from "@infrastructure/constant/errors";
import { IScheduleSettingsRepo } from "@domain/IRepository/IScheduleSettingsRepo";
import { IAppointmentsRepository } from "@domain/IRepository/IAppointmentsRepo";
import { IOverrideRepo } from "@domain/IRepository/IOverrideRepo";
import { IAvailableSlots } from "@domain/IRepository/IAvailableSlots";
import { Daytype } from "@src/application/dtos/AvailableSlotsDto";
import { ILawyerVerificationRepo } from "@domain/IRepository/ILawyerVerificationRepo";
import { IFetchLawyerSlotsUseCase } from "../IFetchLawyerSlotsUseCase";

export class FetchLawyerSlotsUseCase implements IFetchLawyerSlotsUseCase {
    constructor(
        private userRepository: IUserRepository,
        private lawyerRepository: ILawyerVerificationRepo,
        private scheduleSettingsRepo: IScheduleSettingsRepo,
        private appointmentRepo: IAppointmentsRepository,
        private ovverrideRepo: IOverrideRepo,
        private availableSlotsRepo: IAvailableSlots,
    ) {}
    async execute(input: {
        lawyer_id: string;
        date: Date;
        client_id: string;
    }): Promise<{ slots: string[]; isAvailable: boolean }> {
        const { client_id, date, lawyer_id } = input;
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
            const slotDate = new Date();
            slotDate.setHours(hours, minutes, 0, 0);

            return slotDate > now;
        };

        const filterBookedSlots = (slots: string[]) => slots.filter((t) => !booked.has(t));
        const user = await this.userRepository.findByuser_id(lawyer_id);
        if (!user) throw new Error(ERRORS.USER_NOT_FOUND);
        if (user.is_blocked) throw new Error(ERRORS.USER_BLOCKED);
        const lawyer = await this.lawyerRepository.findByUserId(lawyer_id);
        if (!lawyer) throw new Error(ERRORS.USER_NOT_FOUND);
        if (lawyer.verificationStatus !== "verified") throw new Error(ERRORS.LAWYER_NOT_VERIFIED);

        const slotSettings = await this.scheduleSettingsRepo.fetchScheduleSettings(lawyer_id);

        if (!slotSettings) {
            const error: any = new Error("slot settings not found for the lawyer");
            error.code = 404;
            throw error;
        }
        const existingAppointment = await this.appointmentRepo.findByDateandLawyer_id({
            date,
            lawyer_id,
        });

        const booked = new Set<string>();
        existingAppointment?.forEach((a) => a.payment_status !== "failed" && booked.add(a.time));

        const slotDuration = slotSettings.slotDuration;

        const override = await this.ovverrideRepo.fetcghOverrideSlotByDate(lawyer_id, date);

        const availableSlots = await this.availableSlotsRepo.findAvailableSlots(lawyer_id);

        if (!availableSlots) {
            const error: any = new Error("No available slots found for the lawyer");
            error.code = 404;
            throw error;
        }

        const days: Daytype[] = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];

        const index = date.getDay();
        const day = days[index];

        if (!availableSlots.getDayAvailability(day)) {
            const error: any = new Error("No available slots found for the selected date");
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
                    const timeSlot = generateTimeSlots(timeRange.start, timeRange.end, slotDuration);
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
        if (!availableSlots.getDayAvailability(day).enabled) {
            return {
                slots: [],
                isAvailable: false,
            };
        }
        let daySlots: string[] = [];
        for (const range of availableSlots.getDayAvailability(day).timeSlots) {
            daySlots.push(...generateTimeSlots(range.start, range.end, slotDuration));
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
}
