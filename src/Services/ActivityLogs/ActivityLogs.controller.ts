import { Request, Response } from "express";
import {
  getAllActivityLogsServices,
  getActivityLogByIdServices,
  registerActivityLogService,
} from "./ActivityLogs.service";

// 📜 Get All Activity Logs
export const getAllActivityLogs = async (req: Request, res: Response) => {
  try {
    const logs = await getAllActivityLogsServices();
    if (!logs || logs.length === 0) {
      return res.status(404).json({ message: "⚠️ No activity logs found" });
    }
    res.status(200).json(logs);
  } catch (error: any) {
    res.status(500).json({ error: error.message || "❌ Error fetching activity logs" });
  }
};

// 🔍 Get Activity Log By ID
export const getActivityLogById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const log = await getActivityLogByIdServices(Number(id));
    if (!log) {
      return res.status(404).json({ message: "⚠️ Activity log not found" });
    }
    res.status(200).json(log);
  } catch (error: any) {
    res.status(500).json({ error: error.message || "❌ Error fetching activity log" });
  }
};

// Allowed action types
export type ActionType =
  | "emergency_request"
  | "login"
  | "logout"
  | "joker_detected"
  | "trip_update"
  | "other";

// ➕ Log Activity (helper for routes)
export const logActivity = async (
  req: Request,
  actionType: ActionType,
  description: string
): Promise<void> => {
  try {
    const userId = req.user?.id || null;  // ✅ use primary key

    const ipAddress =
      (req.headers["x-forwarded-for"] as string) ||
      req.ip ||
      req.connection.remoteAddress ||
      null;

    await registerActivityLogService({
      userId,
      actionType,
      description,
      ipAddress,
      createdAt: new Date(),
    });
  } catch (error: any) {
    console.error("❌ Error logging activity:", error.message || error);
  }
};

