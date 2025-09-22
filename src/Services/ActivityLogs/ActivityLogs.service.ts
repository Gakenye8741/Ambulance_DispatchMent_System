import db from "../../drizzle/db";
import { activityLogs, TInsertActivityLog, TSelectActivityLog } from "../../drizzle/schema";
import { desc, eq } from "drizzle-orm";

// 📜 Get All Activity Logs (most recent first) with user info
export const getAllActivityLogsServices = async (): Promise<TSelectActivityLog[]> => {
  return await db.query.activityLogs.findMany({
    orderBy: [desc(activityLogs.createdAt)],
    with: {
      user: true, // include related user info
    },
  });
};

// 🔍 Get Activity Log by ID with user info
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
  const logToInsert: TInsertActivityLog = {
    ...log,
    createdAt: log.createdAt || new Date(),
  };

  await db.insert(activityLogs).values(logToInsert).returning();
  return "📝✅ Activity Log Created Successfully 🎉";
};

// 🔧 Helper: Quickly log activity for authenticated users
export const logActivity = async (
  userId: number | null,
  actionType: keyof typeof activityLogs.actionType | string,
  description: string,
  ipAddress?: string
) => {
  await registerActivityLogService({
    userId: userId || null, // attach authenticated user if available
    actionType: actionType as any, // cast if using enum
    description,
    ipAddress: ipAddress || null,
    createdAt: new Date(),
  });
};
