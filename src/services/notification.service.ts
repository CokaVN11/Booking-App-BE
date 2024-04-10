import { NotificationModel } from "@/models";

export class NotificationService {
    private static instance: NotificationService | null = null;

    private constructor() { }

    static getInstance(): NotificationService {
        if (!NotificationService.instance) {
            NotificationService.instance = new NotificationService();
        }

        return NotificationService.instance;
    }

    // Code here    
}