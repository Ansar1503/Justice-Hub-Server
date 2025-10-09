import { LawyerDashboardDto } from "@src/application/dtos/client/DashboardDto";
import { IFetchLawyerDashboardDataUsecase } from "../Interfaces/IFetchLawyerDashboardData";
import { ICaseRepo } from "@domain/IRepository/ICaseRepo";
import { IAppointmentsRepository } from "@domain/IRepository/IAppointmentsRepo";
import { ISessionsRepo } from "@domain/IRepository/ISessionsRepo";
import { IWalletRepo } from "@domain/IRepository/IWalletRepo";
import { IWalletTransactionsRepo } from "@domain/IRepository/IWalletTransactionsRepo";
import { IReviewRepo } from "@domain/IRepository/IReviewRepo";
import { ICommissionTransactionRepo } from "@domain/IRepository/ICommissionTransactionRepo";

export class FetchLawyerDashboardDataUsecase
  implements IFetchLawyerDashboardDataUsecase
{
  constructor(
    private _caseRepo: ICaseRepo,
    private _appointmentRepo: IAppointmentsRepository,
    private _sessionRepo: ISessionsRepo,
    private _walletRepo: IWalletRepo,
    private _walletTransactionRepo: IWalletTransactionsRepo,
    private _reviewRepo: IReviewRepo,
    private _commissionTransactionRepo: ICommissionTransactionRepo
  ) {}

  async execute(input: string): Promise<LawyerDashboardDto> {
    const cases = await this._caseRepo.findAllByUser(input);
    const totalCases = cases.length;
    const activeCases = cases.filter((c) => c.status === "open").length;
    const closedCases = cases.filter((c) => c.status === "closed").length;

    const appointments = await this._appointmentRepo.findByClientID(input);
    const sessions = await this._sessionRepo.findByUserId(input);

    const totalAppointments = appointments.length;
    const upcomingAppointments = appointments.filter(
      (a) => new Date(a.date) > new Date()
    ).length;
    const completedAppointments = sessions.filter(
      (s) => s.status === "completed"
    ).length;
    const pendingAppointments = appointments.filter(
      (a) => a.status === "pending"
    ).length;
    const cancelledAppointments = appointments.filter(
      (a) => a.status === "cancelled"
    ).length;

    const totalSessions = sessions.length;
    const activeSessions = sessions.filter(
      (s) => s.status === "ongoing"
    ).length;

    const wallet = await this._walletRepo.getWalletByUserId(input);
    const walletTransactions = wallet
      ? await this._walletTransactionRepo.findByWalletId(wallet.id)
      : [];

    const commissionTransactions =
      await this._commissionTransactionRepo.findByUserId(input);

    const walletBalance = wallet?.balance || 0;
    const totalEarnings = walletTransactions.reduce((acc, wt) => {
      return wt.type === "credit" ? acc + wt.amount : acc;
    }, 0);

    const totalCommissionPaid = commissionTransactions.reduce(
      (acc, ct) => acc + ct.commissionAmount,
      0
    );

    const upcomingList = appointments
      .filter((a) => new Date(a.date) > new Date() && a.status !== "cancelled")
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const nextAppointment =
      upcomingList.length > 0
        ? {
            id: upcomingList[0].id,
            date: upcomingList[0].date,
            time: upcomingList[0].time,
            clientId: upcomingList[0].client_id,
            clientName: "Client Name Placeholder",
            type: upcomingList[0].type,
            status: upcomingList[0].status,
          }
        : undefined;

    const reviews = await this._reviewRepo.findByUserId(input);
    const totalReviews = reviews.length;
    const averageRating =
      totalReviews > 0
        ? reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / totalReviews
        : 0;

    const recentAppointments = appointments
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, 5);

    const recentCases = cases
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, 5);

    const recentSessions = sessions
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, 5);

    const recentTransactions = walletTransactions
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, 5);

    const recentReviews = reviews
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, 5);

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const earningsThisMonth = walletTransactions
      .filter(
        (t) =>
          t.type === "credit" &&
          t.createdAt.getMonth() === currentMonth &&
          t.createdAt.getFullYear() === currentYear
      )
      .reduce((sum, t) => sum + t.amount, 0);

    const earningsPrevMonth = walletTransactions
      .filter(
        (t) =>
          t.type === "credit" &&
          t.createdAt.getMonth() ===
            (currentMonth === 0 ? 11 : currentMonth - 1) &&
          t.createdAt.getFullYear() ===
            (currentMonth === 0 ? currentYear - 1 : currentYear)
      )
      .reduce((sum, t) => sum + t.amount, 0);

    const earningsGrowthPercent =
      earningsPrevMonth > 0
        ? ((earningsThisMonth - earningsPrevMonth) / earningsPrevMonth) * 100
        : 0;

    const casesThisMonth = cases.filter(
      (c) =>
        c.createdAt.getMonth() === currentMonth &&
        c.createdAt.getFullYear() === currentYear
    ).length;

    const casesPrevMonth = cases.filter(
      (c) =>
        c.createdAt.getMonth() ===
          (currentMonth === 0 ? 11 : currentMonth - 1) &&
        c.createdAt.getFullYear() ===
          (currentMonth === 0 ? currentYear - 1 : currentYear)
    ).length;

    const caseGrowthPercent =
      casesPrevMonth > 0
        ? ((casesThisMonth - casesPrevMonth) / casesPrevMonth) * 100
        : 0;

    return {
      totalCases,
      activeCases,
      closedCases,
      totalAppointments,
      upcomingAppointments,
      completedAppointments,
      pendingAppointments,
      cancelledAppointments,
      totalSessions,
      activeSessions,
      walletBalance,
      totalEarnings,
      totalCommissionPaid,
      earningsGrowthPercent,
      caseGrowthPercent,
      nextAppointment,
      recentAppointments: recentAppointments.map((ra) => ({
        amount: ra.amount,
        bookingId: ra.bookingId,
        caseId: ra.caseId,
        client_id: ra.client_id,
        createdAt: ra.createdAt,
        date: ra.date,
        duration: ra.duration,
        id: ra.id,
        lawyer_id: ra.lawyer_id,
        payment_status: ra.payment_status,
        reason: ra.reason,
        status: ra.status,
        time: ra.time,
        type: ra.type,
        updatedAt: ra.updatedAt,
      })),
      recentCases: recentCases.map((rc) => ({
        caseType: rc.caseType,
        clientId: rc.clientId,
        id: rc.id,
        createdAt: rc.createdAt,
        lawyerId: rc.lawyerId,
        status: rc.status,
        title: rc.title,
        updatedAt: rc.updatedAt,
        estimatedValue: rc.estimatedValue,
        nextHearing: rc.nextHearing,
        summary: rc.summary,
      })),
      recentSessions: recentSessions.map((rs) => ({
        appointment_id: rs.appointment_id,
        bookingId: rs.bookingId,
        caseId: rs.caseId,
        client_id: rs.client_id,
        createdAt: rs.createdAt,
        id: rs.id,
        lawyer_id: rs.lawyer_id,
        status: rs.status,
        updatedAt: rs.updatedAt,
        callDuration: rs.callDuration,
        client_joined_at: rs.client_joined_at,
        client_left_at: rs.client_left_at,
        end_reason: rs.end_reason,
        end_time: rs.end_time,
        follow_up_session_id: rs.follow_up_session_id,
        follow_up_suggested: rs.follow_up_suggested,
        lawyer_joined_at: rs.lawyer_joined_at,
        lawyer_left_at: rs.lawyer_left_at,
        notes: rs.notes,
        room_id: rs.room_id,
        start_time: rs.start_time,
        summary: rs.summary,
      })),
      recentTransactions: recentTransactions.map((rt) => ({
        amount: rt.amount,
        category: rt.category,
        createdAt: rt.createdAt,
        description: rt.description,
        id: rt.id,
        status: rt.status,
        type: rt.type,
        updatedAt: rt.updatedAt,
        walletId: rt.walletId,
      })),
      totalReviews,
      averageRating,
      recentReviews: recentReviews.map((r) => ({
        active: r.active,
        client_id: r.clientId,
        createdAt: r.createdAt,
        heading: r.heading,
        id: r.id,
        lawyer_id: r.lawyerId,
        rating: r.rating,
        review: r.review,
        session_id: r.sessionId,
        updatedAt: r.updatedAt,
      })),
    };
  }
}
