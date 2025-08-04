// import { Appointment } from "../../../domain/entities/Appointment.entity";
// import { Client } from "../../../domain/entities/Client";
// import { Disputes } from "../../../domain/entities/Disputes";
// // import { lawyer } from "../../../domain/entities/Lawyer";
// import { Review } from "../../../domain/entities/Review.entity";
// import { Session } from "../../../domain/entities/Session.entity";
// import { User } from "../../../domain/entities/User";

// export interface IAdminUseCase {
//   // fetchLawyers(query: {
//   //   search?: string;
//   //   status?: "verified" | "rejected" | "pending" | "requested";
//   //   sort: "name" | "experience" | "consultation_fee" | "createdAt";
//   //   sortBy: "asc" | "desc";
//   //   limit: number;
//   //   page: number;
//   // }): Promise<{
//   //   lawyers: any[];
//   //   totalCount: number;
//   //   currentPage: number;
//   //   totalPages: number;
//   // }>;
//   // blockUser(user_id: string): Promise<User>;
//   // changeVerificationStatus(payload: {
//   //   user_id: string;
//   //   status: "verified" | "rejected" | "pending" | "requested";
//   // }): Promise<lawyer>;
//   // fetchAppointments(payload: {
//   //   search?: string;
//   //   limit: number;
//   //   page: number;
//   //   sortBy?: "date" | "amount" | "lawyer_name" | "client_name";
//   //   sortOrder?: "asc" | "desc";
//   //   status?:
//   //     | "pending"
//   //     | "confirmed"
//   //     | "completed"
//   //     | "cancelled"
//   //     | "rejected"
//   //     | "all";
//   //   type?: "consultation" | "follow-up" | "all";
//   // }): Promise<{
//   //   data: (Appointment & { clientData: Client; lawyerData: Client }[]) | [];
//   //   totalCount: number;
//   //   currentPage: number;
//   //   totalPage: number;
//   // }>;
//   // fetchSessions(payload: {
//   //   search?: string;
//   //   limit: number;
//   //   page: number;
//   //   sortBy?: "date" | "amount" | "lawyer_name" | "client_name";
//   //   sortOrder?: "asc" | "desc";
//   //   status?:
//   //     | "upcoming"
//   //     | "ongoing"
//   //     | "completed"
//   //     | "cancelled"
//   //     | "missed"
//   //     | "all";
//   //   type?: "consultation" | "follow-up" | "all";
//   // }): Promise<{
//   //   data: (Session & { clientData: Client; lawyerData: Client }[]) | [];
//   //   totalCount: number;
//   //   currentPage: number;
//   //   totalPage: number;
//   // }>;
//   fetchReviewDisputes(payload: {
//     limit: number;
//     page: number;
//     search: string;
//     sortBy: "review_date" | "reported_date" | "All";
//     sortOrder: "asc" | "desc";
//   }): Promise<{
//     data:
//       | ({
//           contentData: Review;
//           reportedByuserData: Client;
//           reportedUserData: Client;
//         } & Disputes)[]
//       | [];
//     totalCount: number;
//     currentPage: number;
//     totalPage: number;
//   }>;
//   deleteDisputeReview(payload: {
//     reviewId: string;
//     disputeId: string;
//   }): Promise<Disputes | null>;
// }
