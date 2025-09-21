import { desc, eq } from "drizzle-orm";
import db from "../drizzle/db";
import { TInsertUser, TSelectUser, users } from "../drizzle/schema";

// 👥 Get All Users In The System
export const getAllUsersServices = async (): Promise<TSelectUser[]> => {
   return await db.query.users.findMany({
        orderBy: [desc(users.id)]
    })
}

// 🗑️ Delete A User
export const deleteUserServices = async (nationalId: string): Promise<string> => {
    await db.delete(users).where(eq(users.nationalId, nationalId.toString()));
    return "🗑️✅ User Deleted Successfully 🎉";
}

// ✏️ Update A User
export const updateUserServices = async (nationalId: string, user: Partial<TInsertUser>): Promise<string> => {
  const updatedUser = await db.update(users).set(user).where(eq(users.nationalId, nationalId)).returning();
  if (!updatedUser.length) {
    throw new Error("⚠️❌ User not found");
  }
  return "✏️✅ User Updated Successfully 🎉";
};

// 🔍 Get User by National ID
export const getuserByNationalIdServices = async (nationalId: string): Promise<TSelectUser | undefined> => {
  return await db.query.users.findFirst({
    where: eq(users.nationalId, nationalId.toString()),
  });
};
