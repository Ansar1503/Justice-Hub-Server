import { Override } from "@domain/entities/Override";

export interface IOverrideRepo {
  addOverrideSlots(payload: Override): Promise<Override | null>;
  fetchOverrideSlots(lawyer_id: string): Promise<Override | null>;
  fetcghOverrideSlotByDate(
    lawyer_id: string,
    date: Date
  ): Promise<Override | null>;
  removeOverrideSlots(
    lawyer_id: string,
    date: Date
  ): Promise<Override | null>;
}
