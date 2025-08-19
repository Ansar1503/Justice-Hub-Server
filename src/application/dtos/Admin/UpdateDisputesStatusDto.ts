import { DisputesDto } from "../DisputesDto";

export interface UpdateDisputesStatusInputDto {
  disputesId: string;
  status: DisputesDto["status"];
  action?: "deleted" | "blocked";
}

export interface UpdateDisputesStatusOutputDto {
  disputesId: string;
  status: DisputesDto["status"];
  action?: "deleted" | "blocked";
}
