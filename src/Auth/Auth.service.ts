// Auth.service.ts

import { eq } from "drizzle-orm";
import db from "../drizzle/db";
import { TInsertUser, TSelectUser, users } from "../drizzle/schema";


export const registerUserService = async (userData: TInsertUser): Promise<TSelectUser> => {
  const [newUser] = await db.insert(users).values(userData).returning();
  return newUser;
};

export const getUserByEmailService = async (email: string): Promise<TSelectUser | null> => {
  const [user] = await db.select().from(users).where(eq(users.email, email));
  return user ?? null;
};
