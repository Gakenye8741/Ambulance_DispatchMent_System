import { desc, eq } from "drizzle-orm";
import db from "../../drizzle/db";
import { TInsertHospital, TSelectHospital, hospitals } from "../../drizzle/schema";

// 🏥 Get All Hospitals
export const getAllHospitalsServices = async (): Promise<TSelectHospital[]> => {
  return await db.query.hospitals.findMany({
    orderBy: [desc(hospitals.id)]
  });
};

// 🗑️ Delete Hospital
export const deleteHospitalServices = async (id: number): Promise<string> => {
  await db.delete(hospitals).where(eq(hospitals.id, id));
  return "🗑️✅ Hospital Deleted Successfully 🎉";
};

// ✏️ Update Hospital
export const updateHospitalServices = async (
  id: number,
  hospital: Partial<TInsertHospital>
): Promise<string> => {
  const updatedHospital = await db
    .update(hospitals)
    .set(hospital)
    .where(eq(hospitals.id, id))
    .returning();

  if (!updatedHospital.length) {
    throw new Error("⚠️❌ Hospital not found");
  }

  return "✏️✅ Hospital Updated Successfully 🎉";
};

// 🔍 Get Hospital by ID
export const getHospitalByIdServices = async (
  id: number
): Promise<TSelectHospital | undefined> => {
  return await db.query.hospitals.findFirst({
    where: eq(hospitals.id, id),
  });
};

// ➕ Register (Insert) a Hospital
export const registerHospitalService = async (
  hospital: TInsertHospital
): Promise<string> => {
  await db.insert(hospitals).values(hospital).returning();
  return "🏥✅ Hospital Created Successfully 🎉";
};
