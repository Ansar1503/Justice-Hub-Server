import {
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  format,
  startOfDay,
} from "date-fns";
import { IUserRepository } from "@domain/IRepository/IUserRepo";
import { ILawyerVerificationRepo } from "@domain/IRepository/ILawyerVerificationRepo";
import { IScheduleSettingsRepo } from "@domain/IRepository/IScheduleSettingsRepo";
import { IAvailableSlots } from "@domain/IRepository/IAvailableSlots";
import { IAppointmentsRepository } from "@domain/IRepository/IAppointmentsRepo";
import { IOverrideRepo } from "@domain/IRepository/IOverrideRepo";
import { generateTimeSlots } from "@shared/utils/helpers/DateAndTimeHelper";
import { ERRORS } from "@infrastructure/constant/errors";
import { CalendarAvailabilityResponseDto } from "@src/application/dtos/client/fetchLawyerCalendarAvailabilityDto";
import { IFetchLawyerCalendarAvailabilityUseCase } from "../IFetchLawyerCalendarAvailabilityUescase";

export class FetchLawyerCalendarAvailabilityUseCase
  implements IFetchLawyerCalendarAvailabilityUseCase
{
  constructor(
    private userRepo: IUserRepository,
    private lawyerRepo: ILawyerVerificationRepo,
    private scheduleSettingsRepo: IScheduleSettingsRepo,
    private availabilityRepo: IAvailableSlots,
    private overrideRepo: IOverrideRepo,
    private appointmentRepo: IAppointmentsRepository,
  ) {}

  async execute(input: {
    lawyerId: string;
    month?: string;
  }): Promise<CalendarAvailabilityResponseDto> {
    const { lawyerId, month } = input;

    const user = await this.userRepo.findByuser_id(lawyerId);
    if (!user) throw new Error(ERRORS.USER_NOT_FOUND);
    if (user.is_blocked) throw new Error(ERRORS.USER_BLOCKED);

    const lawyer = await this.lawyerRepo.findByUserId(lawyerId);
    if (!lawyer || lawyer.verificationStatus !== "verified")
      throw new Error(ERRORS.LAWYER_NOT_VERIFIED);

    const settings =
      await this.scheduleSettingsRepo.fetchScheduleSettings(lawyerId);
    const availability =
      await this.availabilityRepo.findAvailableSlots(lawyerId);
    // console.log("avali", availability);
    const overrides = await this.overrideRepo.fetchOverrideSlots(lawyerId);

    if (!settings || !availability)
      throw new Error("Lawyer schedule/availability not found");

    const { slotDuration, maxDaysInAdvance } = settings;

    const baseDate = month ? new Date(`${month}-01`) : new Date();
    const monthStart = startOfMonth(baseDate);
    const monthEnd = endOfMonth(baseDate);
    const today = startOfDay(new Date());

    const appointments =
      await this.appointmentRepo.findAppointmentsByLawyerAndRange(
        lawyerId,
        monthStart,
        monthEnd,
      );

    const allDates = eachDayOfInterval({ start: monthStart, end: monthEnd });

    const availableDates = allDates
      .filter((d) => {
        const diff = (d.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);
        return diff >= 0 && diff <= maxDaysInAdvance;
      })
      .map((date) => {
        const dateStr = format(date, "yyyy-MM-dd");
        const isToday = date.toDateString() === new Date().toDateString();
        const currentTime = new Date().toTimeString().slice(0, 5);
        const dayName = [
          "sunday",
          "monday",
          "tuesday",
          "wednesday",
          "thursday",
          "friday",
          "saturday",
        ][date.getDay()];
        // console.log("date.getday", date.getDay());
        // console.log("dayname", dayName);
        const dayAvailability = availability.getDayAvailability(dayName as any);
        let timeRanges = dayAvailability.timeSlots.map((t) => ({
          start: t.start,
          end: t.end,
        }));
        // console.log("datestr", dateStr);
        // console.log("dateobj", date);
        // console.log("dayavailability", dayAvailability);
        let isAvailable = dayAvailability.enabled;

        const overrideForDate = overrides?.overrideDates.find(
          (ov) => format(new Date(ov.date), "yyyy-MM-dd") === dateStr,
        );
        if (overrideForDate) {
          if (overrideForDate.isUnavailable) {
            isAvailable = false;
            timeRanges = [];
          } else if (overrideForDate.timeRanges?.length) {
            timeRanges = overrideForDate.timeRanges;
            isAvailable = true;
          }
        }

        const bookedTimes = new Set(
          appointments
            .filter(
              (appt) =>
                format(new Date(appt.date), "yyyy-MM-dd") === dateStr &&
                appt.payment_status !== "failed",
            )
            .map((appt) => appt.time),
        );

        const timeRangeResults = timeRanges.map((range) => {
          const generatedSlots = generateTimeSlots(
            range.start,
            range.end,
            slotDuration,
          );
          const remaining = generatedSlots.filter((slot) => {
            if (bookedTimes.has(slot)) return false;
            if (isToday && slot <= currentTime) return false;

            return true;
          });

          return {
            start: range.start,
            end: range.end,
            availableSlots: remaining.length,
          };
        });

        const totalAvailable = timeRangeResults.some(
          (r) => r.availableSlots > 0,
        );

        return {
          date: dateStr,
          isAvailable: isAvailable && totalAvailable,
          timeRanges: timeRangeResults,
        };
      });
    // console.log("availableDates ", availableDates);
    return {
      lawyerId,
      month: format(baseDate, "yyyy-MM"),
      availableDates,
      slotDuration,
      maxDaysInAdvance,
    };
  }
}
