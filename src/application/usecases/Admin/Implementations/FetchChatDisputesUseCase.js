"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchChatDisputesUseCase = void 0;
class FetchChatDisputesUseCase {
    disputesRepository;
    constructor(disputesRepository) {
        this.disputesRepository = disputesRepository;
    }
    async execute(input) {
        const disputes = await this.disputesRepository.findAllChatDisputes(input);
        return disputes;
    }
}
exports.FetchChatDisputesUseCase = FetchChatDisputesUseCase;
