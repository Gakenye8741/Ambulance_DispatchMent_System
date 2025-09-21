import db from "../../drizzle/db";
import { activityLogs, TInsertActivityLog, TSelectActivityLog } from "../../drizzle/schema";
import { desc, eq } from "drizzle-orm";

// 📜 Get All Activity Logs (most recent first)
export const getAllActivityLogsServices = async (): Promise<TSelectActivityLog[]> => {
  return await db.query.activityLogs.findMany({
    orderBy: [desc(activityLogs.createdAt)],
    with: {
      user: true, // include user info
    },
  });
};

// 🔍 Get Activity Log by ID
export const getActivityLogByIdServices = async (
  id: number
): Promise<TSelectActivityLog | undefined> => {
  return await db.query.activityLogs.findFirst({
    where: eq(activityLogs.id, id),
    with: {
      user: true, // include user info
    },
  });
};

// ➕ Register Activity Log
export const registerActivityLogService = async (
  log: TInsertActivityLog
): Promise<string> => {
  // Ensure createdAt is set to now if not provided
  const logToInsert = {
    ...log,
    createdAt: log.createdAt || new Date(),
  };

  await db.insert(activityLogs).values(logToInsert).returning();
  return "📝✅ Activity Log Created Successfully 🎉";
};

// 🔧 Helper: Quickly log activity
export const logActivity = async (
  userId: number | null,
  actionType: string,
  description: string,
  ipAddress?: string
) => {
  await registerActivityLogService({
    userId,
    actionType: actionType as any, // cast if using enum
    description,
    ipAddress: ipAddress || null,
  });
};
