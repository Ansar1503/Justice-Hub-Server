interface ChatParticipants {
    lawyer_id: string;
    client_id: string;
}
export interface FetchChatSessionOutPutDto {
    id: string;
    name: string;
    participants: ChatParticipants;
    last_message: string;
    session_id: string;
    createdAt: Date;
    updatedAt: Date;
}
