import { Request, Response } from "express";
import bcrypt from "bcrypt";
import {
  deleteUserServices,
  getAllUsersServices,
  updateUserServices,
  getuserByNationalIdServices,
} from "./users.service";
import { registerActivityLogService } from "../Services/ActivityLogs/ActivityLogs.service";

// 👥 Get All Users
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const allUsers = await getAllUsersServices();
    if (!allUsers || allUsers.length === 0) {
      return res.status(400).json({ message: "⚠️ Hey, no users found" });
    }

    // 📝 Log activity
    await registerActivityLogService({
      userId: (req as any).user?.id || null, // ✅ current logged-in user if available
      actionType: "user_read", // ⚠️ If you want to add read actions, add to enum
      description: "Fetched all users",
      ipAddress: req.ip,
    });

    res.status(200).json({ allUsers });
  } catch (error: any) {
    res.status(500).json({
      error: error.message || "❌ Error Occurred While Fetching Users",
    });
  }
};

// 🔍 Get User By National ID
export const getUserByNationalId = async (req: Request, res: Response) => {
  try {
    const { nationalId } = req.params;
    if (!nationalId) {
      return res.status(400).json({ error: "⚠️ nationalId is required" });
    }

    const user = await getuserByNationalIdServices(String(nationalId));
    if (!user) {
      return res.status(404).json({ error: "❌ User not found" });
    }

    // 📝 Log activity
    await registerActivityLogService({
      userId: (req as any).user?.id || null,
      actionType: "user_read",
      description: `Fetched user with nationalId: ${nationalId}`,
      ipAddress: req.ip,
    });

    res.status(200).json({ user });
  } catch (error: any) {
    res.status(500).json({
      error: error.message || "❌ Error Occurred While Fetching User",
    });
  }
};

// 🗑️ Delete User
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { nationalId } = req.params;
    if (!nationalId) {
      return res.status(400).json({ error: "⚠️ nationalId is required" });
    }

    const deletedUser = await deleteUserServices(nationalId);

    // 📝 Log activity
    await registerActivityLogService({
      userId: (req as any).user?.id || null,
      actionType: "user_delete",
      description: `Deleted user with nationalId: ${nationalId}`,
      ipAddress: req.ip,
    });

    res.status(200).json({ message: deletedUser });
  } catch (error: any) {
    res.status(500).json({
      error: error.message || "❌ Error Occurred While Deleting User",
    });
  }
};

// ✏️ Update User Controller (by nationalId)
export const updateUser = async (req: Request, res: Response) => {
  try {
    const { nationalId } = req.params;
    const { fullName, phone, passwordHash } = req.body;

    if (!nationalId) {
      return res.status(400).json({ error: "⚠️ nationalId is required" });
    }

    const updates: any = {};
    if (fullName) updates.fullName = fullName;
    if (phone) updates.phone = phone;

    if (passwordHash) {
      const salt = await bcrypt.genSalt(10);
      updates.passwordHash = await bcrypt.hash(passwordHash, salt);
    }

    const updatedUser = await updateUserServices(nationalId, updates);

    // 📝 Log activity
    await registerActivityLogService({
      userId: (req as any).user?.id || null,
      actionType: "user_update",
      description: `Updated user with nationalId: ${nationalId}`,
      ipAddress: req.ip,
    });

    res.status(200).json({ message: updatedUser });
  } catch (error: any) {
    res.status(500).json({
      error: error.message || "❌ Error occurred while updating user",
    });
  }
};
