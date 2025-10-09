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
