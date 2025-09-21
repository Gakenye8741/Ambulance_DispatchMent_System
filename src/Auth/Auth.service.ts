import { eq } from "drizzle-orm";
import db from "../drizzle/db";
import { TInsertUser, TSelectUser, users } from "../drizzle/schema";

// Registering A user
export const registerUserService = async (user: TInsertUser) :Promise<string> =>{
  await db.insert(users).values(user).returning()
  return "User Created Successfully";
}

// Login A user
export const getUserByEmailService = async (email: string): Promise <TSelectUser | undefined > => {
    return await db.query.users.findFirst({
        where: (eq(users.email, email))
    })
}