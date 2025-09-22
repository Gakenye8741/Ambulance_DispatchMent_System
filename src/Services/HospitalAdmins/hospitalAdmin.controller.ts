import { Request, Response } from "express";
import {
  getAllHospitalAdminsService,
  getHospitalAdminByIdService,
  registerHospitalAdminService,
  updateHospitalAdminService,
  deleteHospitalAdminService,
} from "./hospitalAdmin.service";
import { registerActivityLogService } from "../ActivityLogs/ActivityLogs.service";

// 👥 Get All Hospital Admins
export const getAllHospitalAdmins = async (req: Request, res: Response) => {
  try {
    const admins = await getAllHospitalAdminsService();
    if (!admins || admins.length === 0) {
      return res.status(404).json({ message: "⚠️ No hospital admins found" });
    }
    res.status(200).json({ admins });
  } catch (error: any) {
    res.status(500).json({
      error: error.message || "❌ Error occurred while fetching hospital admins",
    });
  }
};

// 🔍 Get Hospital Admin By ID
export const getHospitalAdminById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: "⚠️ id is required" });
    }

    const admin = await getHospitalAdminByIdService(Number(id));
    if (!admin) {
      return res.status(404).json({ error: "❌ Hospital admin not found" });
    }

    res.status(200).json({ admin });
  } catch (error: any) {
    res.status(500).json({
      error: error.message || "❌ Error occurred while fetching hospital admin",
    });
  }
};

// ➕ Register Hospital Admin
export const registerHospitalAdmin = async (req: Request, res: Response) => {
  try {
    const { userId, hospitalId } = req.body;

    if (!userId || !hospitalId) {
      return res.status(400).json({ error: "⚠️ userId and hospitalId are required" });
    }

    const message = await registerHospitalAdminService({ userId, hospitalId });

    // 📝 Log activity
    await registerActivityLogService({
      userId: (req as any).user?.id || null,
      actionType: "hospital_admin_create",
      description: `Assigned user ${userId} as admin of hospital ${hospitalId}`,
      ipAddress: req.ip,
    });

    res.status(201).json({ message });
  } catch (error: any) {
    res.status(500).json({
      error: error.message || "❌ Error occurred while registering hospital admin",
    });
  }
};

// ✏️ Update Hospital Admin
export const updateHospitalAdmin = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { userId, hospitalId } = req.body;

    if (!id) {
      return res.status(400).json({ error: "⚠️ id is required" });
    }

    const updates: any = {};
    if (userId) updates.userId = userId;
    if (hospitalId) updates.hospitalId = hospitalId;

    const message = await updateHospitalAdminService(Number(id), updates);

    // 📝 Log activity
    await registerActivityLogService({
      userId: (req as any).user?.id || null,
      actionType: "hospital_admin_update",
      description: `Updated hospital admin ${id} with data: ${JSON.stringify(updates)}`,
      ipAddress: req.ip,
    });

    res.status(200).json({ message });
  } catch (error: any) {
    res.status(500).json({
      error: error.message || "❌ Error occurred while updating hospital admin",
    });
  }
};

// 🗑️ Delete Hospital Admin
export const deleteHospitalAdmin = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: "⚠️ id is required" });
    }

    const message = await deleteHospitalAdminService(Number(id));

    // 📝 Log activity
    await registerActivityLogService({
      userId: (req as any).user?.id || null,
      actionType: "hospital_admin_delete",
      description: `Deleted hospital admin with id: ${id}`,
      ipAddress: req.ip,
    });

    res.status(200).json({ message });
  } catch (error: any) {
    res.status(500).json({
      error: error.message || "❌ Error occurred while deleting hospital admin",
    });
  }
};
