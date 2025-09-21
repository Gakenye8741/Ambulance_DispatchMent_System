import { Router } from "express";
import {
  getAllActivityLogs,
  getActivityLogById,
} from "./ActivityLogs.controller";

const activityLogsRoutes = Router();

// Get all logs
activityLogsRoutes.get("/all", getAllActivityLogs);

// Get log by ID
activityLogsRoutes.get("/:id", getActivityLogById);

export default activityLogsRoutes;
