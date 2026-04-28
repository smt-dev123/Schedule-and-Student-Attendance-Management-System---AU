import { NotificationRepository } from "@/repositories/notification.repository";
import { StudentRepository } from "@/repositories/student.repository";
import { WebSocketManager } from "@/lib/ws-manager";
import { HTTPException } from "hono/http-exception";
import type {
  MarkAsRead,
  Notification,
  NotificationRecipient,
} from "@/types/notification";

export class NotificationService {
  constructor(
    private readonly notificationRepo: NotificationRepository,
    private readonly studentRepo: StudentRepository,
    private readonly wsManager: WebSocketManager,
  ) {}

  async createBroadcast(data: {
    title: string;
    message: string;
    facultyId: number;
    targetDepartment?: number;
    targetGeneration?: number;
    priority?: string;
  }): Promise<Notification> {
    const notification = await this.notificationRepo
      .create(data)
      .catch((error) => {
        console.error("[Notification] Failed to create:", error);
        throw new HTTPException(500, {
          message: "Failed to create notification",
        });
      });

    const targetStudents = await this.studentRepo
      .findByFilter({
        facultyId: data.facultyId,
        departmentId: data.targetDepartment,
        generation: data.targetGeneration,
      })
      .catch((error) => {
        console.error("[Notification] Failed to fetch target students:", error);
        throw new HTTPException(500, {
          message: "Failed to fetch target students",
        });
      });

    if (targetStudents.length === 0) return notification;

    await this.notificationRepo
      .createRecipients(
        targetStudents.map((s) => ({
          notificationId: notification.id,
          studentId: s.id,
        })),
      )
      .catch((error) => {
        console.error("[Notification] Failed to create recipients:", error);
        throw new HTTPException(500, {
          message: "Failed to create recipients",
        });
      });

    targetStudents.forEach((student) => {
      const userId = (student as any).userId;
      if (userId) {
        this.wsManager.sendToUser(userId, {
          type: "NEW_NOTIFICATION",
          data: notification,
        });
      }
    });

    return notification;
  }

  async findMyNotifications(userId: string): Promise<NotificationRecipient[]> {
    const student = await this.studentRepo.findByUserId(userId);
    if (!student) {
      throw new HTTPException(404, { message: "Student not found" });
    }
    return this.notificationRepo.findUnreadByStudent(student.id);
  }

  async markAsRead(recipientId: number): Promise<MarkAsRead> {
    const updated = await this.notificationRepo.markAsRead(recipientId);
    if (!updated) {
      throw new HTTPException(404, {
        message: "Notification recipient not found",
      });
    }
    return updated;
  }

  async findAll(): Promise<Notification[]> {
    return this.notificationRepo.findAll();
  }

  async findById(id: number): Promise<Notification> {
    const notification = await this.notificationRepo.findById(id);
    if (!notification) {
      throw new HTTPException(404, { message: "Notification not found" });
    }
    return notification;
  }

  async delete(id: number): Promise<void> {
    const deleted = await this.notificationRepo.delete(id);
    if (!deleted) {
      throw new HTTPException(404, { message: "Notification not found" });
    }
  }
}
