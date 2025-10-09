import { ClientDashboardDto } from "@src/application/dtos/client/DashboardDto";
import { IFetchClientDashboardDataUsecase } from "../Interfaces/IFetchClientDashboardDataUsecase";
import { ICaseRepo } from "@domain/IRepository/ICaseRepo";
import { IAppointmentsRepository } from "@domain/IRepository/IAppointmentsRepo";
import { IWalletRepo } from "@domain/IRepository/IWalletRepo";
import { IUserRepository } from "@domain/IRepository/IUserRepo";
import { ISessionsRepo } from "@domain/IRepository/ISessionsRepo";

export class FetchClientDashboardDataUsecase
  implements IFetchClientDashboardDataUsecase
{
  constructor(
    private _casesRepo: ICaseRepo,
    private _appointmentsRepo: IAppointmentsRepository,
    private _walletRepo: IWalletRepo,
    private _userRepo: IUserRepository,
    private _sessionRepo: ISessionsRepo
  ) {}

  async execute(input: string): Promise<ClientDashboardDto> {
    // --- Cases ---
    const cases = await this._casesRepo.findAllByUser(input);
    const totalCases = cases.length;
    const activeCases = cases.filter((c) => c.status === "open").length;
    const closedCases = cases.filter((c) => c.status === "closed").length;

    const recentCases = cases
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, 5);

    // --- Appointments ---
    const appointments = await this._appointmentsRepo.findByClientID(input);
    const totalAppointments = appointments.length;

    const upcomingAppointmentsList = appointments
      .filter((a) => new Date(a.date) > new Date() && a.status !== "cancelled")
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const nextAppointment =
      upcomingAppointmentsList.length > 0
        ? {
            id: upcomingAppointmentsList[0].id,
            date: upcomingAppointmentsList[0].date,
            time: upcomingAppointmentsList[0].time,
            lawyerId: upcomingAppointmentsList[0].lawyer_id,
            lawyerName:
              (
                await this._userRepo.findByuser_id(
                  upcomingAppointmentsList[0].lawyer_id
                )
              )?.name || "N/A",
            type: upcomingAppointmentsList[0].type,
            status: upcomingAppointmentsList[0].status,
          }
        : undefined;

    const pendingPayments = appointments.filter(
      (a) => a.payment_status === "pending"
    );

    // --- Wallet ---
    const wallet = await this._walletRepo.getWalletByUserId(input);
    const walletBalance = wallet?.balance || 0;

    // --- Sessions ---
    const sessionsAll = await this._sessionRepo.findByUserId(input);
    const upcomingSessions = sessionsAll
      .filter((s) => s.status !== "cancelled")
      .sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      )
      .slice(0, 5)
      .map((s) => ({
        id: s.id,
        appointment_id: s.appointment_id,
        lawyer_id: s.lawyer_id,
        client_id: s.client_id,
        caseId: s.caseId,
        bookingId: s.bookingId,
        status: s.status,
        notes: s.notes,
        summary: s.summary,
        follow_up_suggested: s.follow_up_suggested,
        follow_up_session_id: s.follow_up_session_id,
        room_id: s.room_id,
        start_time: s.start_time,
        end_time: s.end_time,
        client_joined_at: s.client_joined_at,
        client_left_at: s.client_left_at,
        lawyer_joined_at: s.lawyer_joined_at,
        lawyer_left_at: s.lawyer_left_at,
        end_reason: s.end_reason,
        callDuration: s.callDuration,
        createdAt: s.createdAt,
        updatedAt: s.updatedAt,
      }));

    const dashboardDto: ClientDashboardDto = {
      totalCases,
      activeCases,
      completedCases: closedCases,
      totalAppointments,
      upcomingAppointments: upcomingAppointmentsList.length,
      pendingPayments: pendingPayments.length,
      walletBalance,
      nextAppointment,
      cases: recentCases.map((c) => ({
        caseType: c.caseType,
        clientId: c.clientId,
        createdAt: c.createdAt,
        id: c.id,
        lawyerId: c.lawyerId,
        status: c.status,
        title: c.title,
        updatedAt: c.updatedAt,
        estimatedValue: c.estimatedValue,
        nextHearing: c.nextHearing,
        summary: c.summary, 
      })),
      sessions: upcomingSessions,
    };

    return dashboardDto;
  }
}
