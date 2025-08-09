import { Availability } from "@domain/entities/Availability";

export interface IAvailableSlots {
  updateAvailbleSlot(
    payload: Availability,
  ): Promise<Availability | null>;
  findAvailableSlots(lawyer_id: string): Promise<Availability | null>;
}
