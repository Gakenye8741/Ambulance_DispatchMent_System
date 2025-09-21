import { desc, eq } from "drizzle-orm";
import db from "../../drizzle/db";
import { ambulances, TInsertAmbulance, TSelectAmbulance } from "../../drizzle/schema";

// 🚑 ➕ Register an Ambulance
export const registerAmbulanceService = async (
  ambulance: TInsertAmbulance
): Promise<string> => {
  await db.insert(ambulances).values(ambulance).returning();
  return "🚑✅ Ambulance Registered Successfully 🎉";
};

// 🚑 👥 Get All Ambulances
export const getAllAmbulancesService = async (): Promise<TSelectAmbulance[]> => {
  return await db.query.ambulances.findMany({
    orderBy: [desc(ambulances.id)],
  });
};

// 🚑 🔍 Get Ambulance by ID
export const getAmbulanceByIdService = async (
  id: number
): Promise<TSelectAmbulance | undefined> => {
  return await db.query.ambulances.findFirst({
    where: eq(ambulances.id, id),
  });
};

// 🚑 ✏️ Update Ambulance
export const updateAmbulanceService = async (
  id: number,
  updates: Partial<TInsertAmbulance>
): Promise<string> => {
  const updated = await db
    .update(ambulances)
    .set(updates)
    .where(eq(ambulances.id, id))
    .returning();

  if (!updated.length) {
    throw new Error("⚠️❌ Ambulance not found");
  }
  return "🚑✅ Ambulance Updated Successfully 🎉";
};

// 🚑 🗑️ Delete Ambulance
export const deleteAmbulanceService = async (id: number): Promise<string> => {
  await db.delete(ambulances).where(eq(ambulances.id, id));
  return "🚑🗑️ Ambulance Deleted Successfully 🎉";
};
