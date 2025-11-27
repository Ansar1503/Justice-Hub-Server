import { Appointment } from "../Appointments/BaseAppointmentDto";
import { CaseDto } from "../Cases/CasesDto";
import { ReviewDto } from "../Reviews/review.dto";
import { BaseSessionDto } from "../sessions/BaseSessionDto";
import { WalletTransactionDto } from "../wallet/WalletTransactionDto";

export interface ClientDashboardDto {
  totalCases: number;
  activeCases: number;
  completedCases: number;

  totalAppointments: number;
  upcomingAppointments: number;
  pendingPayments: number;

  walletBalance: number;

  nextAppointment?: {
    id: string;
    date: Date;
    time: string;
    lawyerId: string;
    lawyerName: string;
    type: "consultation" | "follow-up";
    status: "pending" | "confirmed" | "completed" | "cancelled" | "rejected";
  };
  cases: CaseDto[];
  sessions: BaseSessionDto[];
}

export interface LawyerDashboardDto {
  totalCases: number;
  activeCases: number;
  closedCases: number;

  totalAppointments: number;
  upcomingAppointments: number;
  completedAppointments: number;
  pendingAppointments: number;
  cancelledAppointments: number;

  totalSessions: number;
  activeSessions: number;

  walletBalance: number;
  totalEarnings: number;
  totalCommissionPaid: number;

  earningsGrowthPercent?: number;
  caseGrowthPercent?: number;

  nextAppointment?: {
    id: string;
    date: Date;
    time: string;
    clientId: string;
    clientName: string;
    type: "consultation" | "follow-up";
    status: "pending" | "confirmed" | "completed" | "cancelled" | "rejected";
  };

  recentAppointments: Appointment[] | [];
  recentCases: CaseDto[] | [];
  recentSessions: BaseSessionDto[] | [];
  recentTransactions: WalletTransactionDto[] | [];

  totalReviews: number;
  averageRating: number;
  recentReviews: ReviewDto[] | [];
}

export interface DashboardSummaryDto {
  totalUsers: number;
  totalLawyers: number;
  totalClients: number;
  totalCommission: number;
  totalLawyerPayouts: number;
  totalBookingAmountCollected: number;
  commissionGrowthPercent: number;
  subscriptionRevenue: number;
  subscriptionGrowthPercent: number;
  activeSubscriptions: number;
  expiredSubscriptions: number;
  newSubscriptions: number;
  activeCases: number;
  totalRevenue: number;
}

export interface DashboardTrendItemDto {
  date: string;
  commissionRevenue: number;
  subscriptionRevenue: number;
  cases: number;
}

export interface TopLawyerDto {
  name: string;
  casesHandled: number;
  earnings: number;
}

export interface TransactionDto {
  id: string;
  amount: number;
  status: "pending" | "completed" | "failed" | "cancelled";
  date: string;
}

export interface DisputeDto {
  id: string;
  type: string;
  status: "pending" | "resolved" | "rejected";
  reportedBy: string;
}

export interface AdminDashboardDto {
  summary: DashboardSummaryDto;
  trends: DashboardTrendItemDto[];
  topLawyers: TopLawyerDto[];
  recentTransactions: TransactionDto[];
  recentDisputes: DisputeDto[];
}