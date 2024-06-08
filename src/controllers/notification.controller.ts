import { Request, Response } from "express";
import { NotificationService } from "@services";

export class NotificationController {
  private static instance: NotificationController | null = null;

  private constructor() {}

  static getInstance(): NotificationController {
    if (!NotificationController.instance) {
      NotificationController.instance = new NotificationController();
    }

    return NotificationController.instance;
  }

  getNotificationByTo = async (req: Request, res: Response) => {
    try {
      const { to } = req.params;
      const notifications =
        await NotificationService.getInstance().getNotificationByTo(to);
      return res.status(200).json({ data: notifications });
    } catch (error) {
      const _error = error as Error;
      return res.status(500).json({ message: _error.message });
    }
  };

  getNotificationByFrom = async (req: Request, res: Response) => {
    try {
      const { from } = req.params;
      const notifications =
        await NotificationService.getInstance().getNotificationByFrom(from);
      return res.status(200).json({ data: notifications });
    } catch (error) {
      const _error = error as Error;
      return res.status(500).json({ message: _error.message });
    }
  };
}
