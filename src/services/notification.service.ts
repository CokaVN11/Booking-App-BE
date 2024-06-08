import { NotificationModel } from "@models";

export class NotificationService {
  private static instance: NotificationService | null = null;

  private constructor() {}

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

  getNotificationByTo = async (to: string) => {
    try {
      const notifications = await NotificationModel.find({ to_id: to });
      return notifications;
    } catch (error) {
      const _error = error as Error;
      throw new Error(_error.message);
    }
  };

  getNotificationByFrom = async (from: string) => {
    try {
      const notifications = await NotificationModel.find({ from_id: from });
      return notifications;
    } catch (error) {
      const _error = error as Error;
      throw new Error(_error.message);
    }
  };

  updateNotification = async (notification: Noti) => {
    try {
      const updatedNotification = await NotificationModel.findOneAndUpdate(
        { booking: notification.booking },
        notification
      );
      return updatedNotification;
    } catch (error) {
      const _error = error as Error;
      throw new Error(_error.message);
    }
  };
}
