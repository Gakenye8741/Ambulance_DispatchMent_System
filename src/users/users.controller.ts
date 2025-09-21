import { Request, Response } from "express";
import bcrypt from "bcrypt";
import {
  deleteUserServices,
  getAllUsersServices,
  updateUserServices,
  getuserByNationalIdServices,
} from "./users.service";

// 👥 Get All Users
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const allUsers = await getAllUsersServices();
    if (!allUsers || allUsers.length === 0) {
      res.status(400).json({ message: "⚠️ Hey, no users found" });
    } else {
      res.status(200).json({ allUsers });
    }
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
      res.status(400).json({ error: "⚠️ nationalId is required" });
      return;
    }

    const user = await getuserByNationalIdServices(String(nationalId));
    if (!user) {
      res.status(404).json({ error: "❌ User not found" });
      return;
    }

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
    const { nationalId } = req.params; // ✅ read from URL params
    if (!nationalId) {
      res.status(400).json({ error: "⚠️ nationalId is required" });
      return;
    }

    const deletedUser = await deleteUserServices(nationalId);
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
      res.status(400).json({ error: "⚠️ nationalId is required" });
      return;
    }

    // Only allow updating fullName, phone, password
    const updates: any = {};
    if (fullName) updates.fullName = fullName;
    if (phone) updates.phone = phone;

    if (passwordHash) {
      const salt = await bcrypt.genSalt(10);
      updates.passwordHash = await bcrypt.hash(passwordHash, salt);
    }

    const updatedUser = await updateUserServices(nationalId, updates);
    res.status(200).json({ message: updatedUser });
  } catch (error: any) {
    res.status(500).json({
      error: error.message || "❌ Error occurred while updating user",
    });
  }
};
