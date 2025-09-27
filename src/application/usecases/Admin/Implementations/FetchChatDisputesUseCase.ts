import { IDisputes } from "@domain/IRepository/IDisputesRepo";
import {
    FetchChatDisputesInputDto,
    FetchChatDisputesOutputDto,
} from "@src/application/dtos/Admin/FetchChatDisputesDto";
import { IFetchChatDisputesUseCase } from "../IFetchChatDisputesUseCase";

export class FetchChatDisputesUseCase implements IFetchChatDisputesUseCase {
    constructor(private disputesRepository: IDisputes) {}
    async execute(input: FetchChatDisputesInputDto): Promise<FetchChatDisputesOutputDto> {
        const disputes = await this.disputesRepository.findAllChatDisputes(input);
        return disputes;
    }
}
