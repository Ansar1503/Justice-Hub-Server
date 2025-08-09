type SessionType = "consultation" | "follow-up";
type SessionStatus =
  | "upcoming"
  | "ongoing"
  | "completed"
  | "cancelled"
  | "missed";

export interface CancelSessionInputDto {
  session_id: string;
  status?: string;
  start_time?: Date;
  end_time?: Date;
  client_joined_at?: Date;
  lawyer_joined_at?: Date;
  notes?: string;
  summary?: string;
  follow_up_suggested?: boolean;
  follow_up_session_id?: string;
}

export interface CancelSessionOutputDto {
  id: string;
  appointment_id: string;
  lawyer_id: string;
  client_id: string;
  scheduled_date: Date;
  scheduled_time: string;
  duration: number;
  reason: string;
  amount: number;
  type: SessionType;
  status: SessionStatus;
  notes?: string;
  summary?: string;
  follow_up_suggested?: boolean;
  follow_up_session_id?: string;
  room_id?: string;
  start_time?: Date;
  end_time?: Date;
  client_joined_at?: Date;
  client_left_at?: Date;
  lawyer_joined_at?: Date;
  lawyer_left_at?: Date;
  end_reason?: string;
  callDuration?: number;
  createdAt: Date;
  updatedAt: Date;
}


// export class EndSessionOutputDto {
//   constructor(
//     private readonly id: string,
//     private readonly appointment_id: string,
//     private readonly lawyer_id: string,
//     private readonly client_id: string,
//     private readonly scheduled_date: Date,
//     private readonly scheduled_time: string,
//     private readonly duration: number,
//     private readonly reason: string,
//     private readonly amount: number,
//     private readonly type: SessionType,
//     private readonly status: SessionStatus,
//     private readonly notes?: string,
//     private readonly summary?: string,
//     private readonly follow_up_suggested?: boolean,
//     private readonly follow_up_session_id?: string,
//     private readonly room_id?: string,
//     private readonly start_time?: Date,
//     private readonly end_time?: Date,
//     private readonly client_joined_at?: Date,
//     private readonly client_left_at?: Date,
//     private readonly lawyer_joined_at?: Date,
//     private readonly lawyer_left_at?: Date,
//     private readonly end_reason?: string,
//     private readonly callDuration?: number,
//     private readonly createdAt?: Date,
//     private readonly updatedAt?: Date
//   ) {}

//   static fromDto(dto: CancelSessionOutputDto): EndSessionOutputDto {
//     return new EndSessionOutputDto(
//       dto.id,
//       dto.appointment_id,
//       dto.lawyer_id,
//       dto.client_id,
//       dto.scheduled_date,
//       dto.scheduled_time,
//       dto.duration,
//       dto.reason,
//       dto.amount,
//       dto.type,
//       dto.status,
//       dto.notes,
//       dto.summary,
//       dto.follow_up_suggested,
//       dto.follow_up_session_id,
//       dto.room_id,
//       dto.start_time,
//       dto.end_time,
//       dto.client_joined_at,
//       dto.client_left_at,
//       dto.lawyer_joined_at,
//       dto.lawyer_left_at,
//       dto.end_reason,
//       dto.callDuration,
//       dto.createdAt,
//       dto.updatedAt
//     );
//   }
// }
