import { axiosInstance } from "@/lib/ApiClient";
import { BaseService } from "./base.service";

// Define interface for the notification data structure
export interface INotification {
  id: string;
  user: string;
  message: string;
  type: 'info' | 'warning' | 'action';
  link?: string;
  read: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateNotificationDto {
  user: string;
  message: string;
  type?: 'info' | 'warning' | 'action';
  link?: string;
}

export class NotificationService extends BaseService {
  constructor() {
    super(axiosInstance, "/api/v1/secure/notification");
  }

  // Get notifications for a specific user
  async getUserNotifications(userId: string): Promise<INotification[]> {
    return this.get<INotification[]>(`/?userId=${userId}`);
  }

  // Create and send a new notification
  async send(user: string, message: string, type: 'info' | 'warning' | 'action', link?: string): Promise<INotification> {
    return this.post<INotification>("/", { user, message, type, link });
  }

  // Mark a notification as read
  async markAsRead(id: string): Promise<INotification> {
    return this.put<INotification>(`/${id}/read`, {});
  }

  // Delete a notification
  //ahad bhai check this error
  async delete(id: string): Promise<any> {
    return this.delete(`/${id}`);
  }

  // Get the count of unread notifications for a user
  async getUnreadCount(userId: string): Promise<number> {
    return this.get<number>(`/unread-count?userId=${userId}`);
  }
}