import { IUseCase } from "../IUseCases/IUseCase";

export interface IFetchLawyerSlotsUseCase
    extends IUseCase<
        {
            lawyer_id: string;
            date: Date;
            client_id: string;
        },
        { slots: string[]; isAvailable: boolean }
    > {}
