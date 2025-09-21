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
      res.status(404).json({ message: "⚠️ No activity logs found" });
      return;
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
      res.status(404).json({ message: "⚠️ Activity log not found" });
      return;
    }
    res.status(200).json(log);
  } catch (error: any) {
    res.status(500).json({ error: error.message || "❌ Error fetching activity log" });
  }
};

// Define allowed action types
type ActionType = "emergency_request" | "login" | "logout" | "joker_detected" | "trip_update" | "other";

// ➕ Log Activity (automated)
export const logActivity = async (
  req: Request,
  res: Response,
  actionType: ActionType,
  description: string
) => {
  try {
    const userId = (req.user as any)?.id;
    const ipAddress =
      req.ip || (req.headers["x-forwarded-for"] as string) || req.connection.remoteAddress;

    if (!userId) {
      res.status(400).json({ error: "⚠️ User ID not found in request" });
      return;
    }

    const message = await registerActivityLogService({
      userId,
      actionType,
      description,
      ipAddress,
    });

    res.status(201).json({ message });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "❌ Error logging activity" });
  }
};
