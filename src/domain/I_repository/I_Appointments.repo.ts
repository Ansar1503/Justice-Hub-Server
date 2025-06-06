import { Appointment } from "../entities/Appointment.entity";

export interface IAppointmentsRepository {
  findByDate(payload: {
    lawyer_id: string;
    date: Date;
  }): Promise<Appointment[] | null>;
  createWithTransaction(payload: Appointment): Promise<Appointment>;
  Update(payload: Partial<Appointment>): Promise<Appointment | null>;
}
