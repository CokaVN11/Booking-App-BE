import { Request, Response } from "express";
import { NotificationService } from "@/services";

export class NotificationController {
    private static instance: NotificationController | null = null;

    private constructor() { }

    static getInstance(): NotificationController {
        if (!NotificationController.instance) {
            NotificationController.instance = new NotificationController();
        }

        return NotificationController.instance;
    }

    // Code here
}