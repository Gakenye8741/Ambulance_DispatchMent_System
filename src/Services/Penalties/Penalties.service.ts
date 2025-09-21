import { desc, eq, sql } from "drizzle-orm";
import db from "../../drizzle/db";
import { penalties, TInsertPenalty, TSelectPenalty, users } from "../../drizzle/schema";

// 📜 Get All Penalties
export const getAllPenaltiesServices = async (): Promise<TSelectPenalty[]> => {
  return await db.query.penalties.findMany({
    orderBy: [desc(penalties.id)],
    with: {
      user: true,
    },
  });
};

// 🔍 Get Penalty by ID
export const getPenaltyByIdServices = async (
  id: number
): Promise<TSelectPenalty | undefined> => {
  return await db.query.penalties.findFirst({
    where: eq(penalties.id, id),
  });
};

// ➕ Register (Insert) a Penalty with auto-suspension
export const registerPenaltyService = async (
  penalty: TInsertPenalty
): Promise<string> => {
  // Insert the penalty
  await db.insert(penalties).values(penalty).returning();

  // Calculate total penalties for this user
  const userPenalties = await db.query.penalties.findMany({
    where: eq(penalties.userId, penalty.userId),
  });

  const totalCount = userPenalties.length;

  // Suspend user if total penalties >= 3
  if (totalCount >= 3) {
    await db.update(users).set({ status: "deactivated" }).where(eq(users.id, penalty.userId));
    return "⚖️✅ Penalty added. User deactivated due to repeated penalties ⚠️";
  }

  return "⚖️✅ Penalty Created Successfully 🎉";
};

// ✏️ Update Penalty
export const updatePenaltyServices = async (
  id: number,
  penalty: Partial<TInsertPenalty>
): Promise<string> => {
  const updatedPenalty = await db
    .update(penalties)
    .set(penalty)
    .where(eq(penalties.id, id))
    .returning();

  if (!updatedPenalty.length) {
    throw new Error("⚠️❌ Penalty not found");
  }

  return "✏️✅ Penalty Updated Successfully 🎉";
};

// 🗑️ Delete Penalty
export const deletePenaltyServices = async (id: number): Promise<string> => {
  await db.delete(penalties).where(eq(penalties.id, id));
  return "🗑️✅ Penalty Deleted Successfully 🎉";
};
