interface Attachment {
    name: string;
    url: string;
    type: string;
}
export interface ChatMessageInputDto {
    session_id: string;
    senderId: string;
    receiverId: string;
    content?: string;
    attachments?: Attachment[];
}

export interface ChatMessageOutputDto {
    id: string;
    session_id: string;
    senderId: string;
    receiverId: string;
    content?: string;
    read: boolean;
    active: boolean;
    attachments?: Attachment[];
    createdAt: Date;
    updatedAt: Date;
}
