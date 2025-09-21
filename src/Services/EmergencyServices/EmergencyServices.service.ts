import { desc, eq } from "drizzle-orm";
import db from "../../drizzle/db";
import { TInsertEmergencyRequest, TSelectEmergencyRequest, emergencyRequests } from "../../drizzle/schema";

// ➕ Create Emergency Request
export const createEmergencyRequestService = async (
  request: TInsertEmergencyRequest
): Promise<string> => {
  await db.insert(emergencyRequests).values(request).returning();
  return "🚑✅ Emergency request created successfully!";
};

// 👥 Get All Emergency Requests
export const getAllEmergencyRequestsService = async (): Promise<TSelectEmergencyRequest[]> => {
  return await db.query.emergencyRequests.findMany({
    orderBy: [desc(emergencyRequests.id)],
    with: {
        hospital: true,
        ambulance: true,
        patient: true
    }
  });
};

// 🔍 Get Emergency Request By ID
export const getEmergencyRequestByIdService = async (
  id: number
): Promise<TSelectEmergencyRequest | undefined> => {
  return await db.query.emergencyRequests.findFirst({
    where: eq(emergencyRequests.id, id),
     with: {
        hospital: true,
        ambulance: true,
        patient: true
    }
  });
};

// ✏️ Update Emergency Request
export const updateEmergencyRequestService = async (
  id: number,
  updates: Partial<TInsertEmergencyRequest>
): Promise<string> => {
  const updated = await db
    .update(emergencyRequests)
    .set(updates)
    .where(eq(emergencyRequests.id, id))
    .returning();

  if (!updated.length) {
    throw new Error("⚠️❌ Emergency request not found");
  }

  return "✏️✅ Emergency request updated successfully!";
};

// 🗑️ Delete Emergency Request
export const deleteEmergencyRequestService = async (id: number): Promise<string> => {
  const deleted = await db.delete(emergencyRequests).where(eq(emergencyRequests.id, id)).returning();

  if (!deleted.length) {
    throw new Error("⚠️❌ Emergency request not found");
  }

  return "🗑️✅ Emergency request deleted successfully!";
};
