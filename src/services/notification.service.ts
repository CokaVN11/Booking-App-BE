import { NotificationModel } from "@models";

export class NotificationService {
    private static instance: NotificationService | null = null;

    private constructor() { }

    static getInstance(): NotificationService {
        if (!NotificationService.instance) {
            NotificationService.instance = new NotificationService();
        }

        return NotificationService.instance;
    }

    addNotification = async (notification: Noti) => {
        try {
            const newNotification = new NotificationModel(notification);
            await newNotification.save();
            return newNotification;
        } catch (error) {
            const _error = error as Error;
            throw new Error(_error.message);
        }
    }; 
}