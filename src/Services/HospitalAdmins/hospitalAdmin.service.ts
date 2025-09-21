import { desc, eq } from "drizzle-orm";
import db from "../../drizzle/db";
import { hospitalAdmins, TInsertHospitalAdmin, TSelectHospitalAdmin } from "../../drizzle/schema";

// 👥 Get All Hospital Admins
export const getAllHospitalAdminsService = async (): Promise<TSelectHospitalAdmin[]> => {
  return await db.query.hospitalAdmins.findMany({
    orderBy: [desc(hospitalAdmins.id)],
    with: {
        user: true,
        hospital: true
    }
  });
};

// 🔍 Get Hospital Admin by ID
export const getHospitalAdminByIdService = async (
  id: number
): Promise<TSelectHospitalAdmin | undefined> => {
  return await db.query.hospitalAdmins.findFirst({
    where: eq(hospitalAdmins.id, id),
    with: {
        user: true,
        hospital: true
    }
  });
};

// ➕ Register Hospital Admin
export const registerHospitalAdminService = async (
  admin: TInsertHospitalAdmin
): Promise<string> => {
  await db.insert(hospitalAdmins).values(admin).returning();
  return "✅ Hospital Admin Registered Successfully 🎉";
};

// ✏️ Update Hospital Admin (userId or hospitalId)
export const updateHospitalAdminService = async (
  id: number,
  admin: Partial<TInsertHospitalAdmin>
): Promise<string> => {
  const updated = await db
    .update(hospitalAdmins)
    .set(admin)
    .where(eq(hospitalAdmins.id, id))
    .returning();

  if (!updated.length) {
    throw new Error("⚠️❌ Hospital Admin not found");
  }
  return "✏️✅ Hospital Admin Updated Successfully 🎉";
};

// 🗑️ Delete Hospital Admin
export const deleteHospitalAdminService = async (id: number): Promise<string> => {
  await db.delete(hospitalAdmins).where(eq(hospitalAdmins.id, id));
  return "🗑️✅ Hospital Admin Deleted Successfully 🎉";
};
