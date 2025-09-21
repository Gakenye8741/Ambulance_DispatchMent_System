import { Request, Response } from "express";
import {
  getAllHospitalAdminsService,
  getHospitalAdminByIdService,
  registerHospitalAdminService,
  updateHospitalAdminService,
  deleteHospitalAdminService,
} from "./hospitalAdmin.service";

// 👥 Get All Hospital Admins
export const getAllHospitalAdmins = async (req: Request, res: Response) => {
  try {
    const admins = await getAllHospitalAdminsService();
    if (!admins || admins.length === 0) {
      res.status(404).json({ message: "⚠️ No hospital admins found" });
      return;
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
      res.status(400).json({ error: "⚠️ id is required" });
      return;
    }

    const admin = await getHospitalAdminByIdService(Number(id));
    if (!admin) {
      res.status(404).json({ error: "❌ Hospital admin not found" });
      return;
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
      res.status(400).json({ error: "⚠️ userId and hospitalId are required" });
      return;
    }

    const message = await registerHospitalAdminService({ userId, hospitalId });
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
      res.status(400).json({ error: "⚠️ id is required" });
      return;
    }

    const updates: any = {};
    if (userId) updates.userId = userId;
    if (hospitalId) updates.hospitalId = hospitalId;

    const message = await updateHospitalAdminService(Number(id), updates);
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
      res.status(400).json({ error: "⚠️ id is required" });
      return;
    }

    const message = await deleteHospitalAdminService(Number(id));
    res.status(200).json({ message });
  } catch (error: any) {
    res.status(500).json({
      error: error.message || "❌ Error occurred while deleting hospital admin",
    });
  }
};
