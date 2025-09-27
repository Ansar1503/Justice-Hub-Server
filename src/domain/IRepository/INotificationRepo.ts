import { Notification } from "../entities/Notification";

export interface INotificationRepo {
    addNotification(notification: Notification): Promise<Notification>;
    getNotification(receipntId: string): Promise<Notification | null>;
    findById(id: string): Promise<Notification | null>;
    updateStatusById(id: string, status: boolean): Promise<Notification | null>;
    findAllByUserId(payload: {
        userId: string;
        cursor: number;
    }): Promise<{ data: Notification[] | []; nextCursor?: number }>;
    updateAllByReceiverId(receiverId: string): Promise<void>;
}
