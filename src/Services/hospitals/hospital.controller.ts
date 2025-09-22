import { Request, Response } from "express";
import {
  deleteHospitalServices,
  getAllHospitalsServices,
  updateHospitalServices,
  getHospitalByIdServices,
  registerHospitalService,
} from "./hospital.service";
import { registerActivityLogService } from "../ActivityLogs/ActivityLogs.service";

// 🏥 Get All Hospitals
export const getAllHospitals = async (req: Request, res: Response) => {
  try {
    const allHospitals = await getAllHospitalsServices();
    if (!allHospitals || allHospitals.length === 0) {
      return res.status(400).json({ message: "⚠️ No hospitals found" });
    }

    res.status(200).json({ allHospitals });
  } catch (error: any) {
    res.status(500).json({
      error: error.message || "❌ Error Occurred While Fetching Hospitals",
    });
  }
};

// 🔍 Get Hospital By ID
export const getHospitalById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: "⚠️ id is required" });
    }

    const hospital = await getHospitalByIdServices(Number(id));
    if (!hospital) {
      return res.status(404).json({ error: "❌ Hospital not found" });
    }

    res.status(200).json({ hospital });
  } catch (error: any) {
    res.status(500).json({
      error: error.message || "❌ Error Occurred While Fetching Hospital",
    });
  }
};

// ➕ Register Hospital
export const registerHospital = async (req: Request, res: Response) => {
  try {
    const hospitalData = req.body;
    const message = await registerHospitalService(hospitalData);

    // 📝 Log activity
    await registerActivityLogService({
      userId: (req as any).user?.id || null,
      actionType: "hospital_create",
      description: `Registered new hospital: ${hospitalData.name || "Unknown"}`,
      ipAddress: req.ip,
    });

    res.status(201).json({ message });
  } catch (error: any) {
    res.status(500).json({
      error: error.message || "❌ Error Occurred While Creating Hospital",
    });
  }
};

// 🗑️ Delete Hospital
export const deleteHospital = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: "⚠️ id is required" });
    }

    const deletedHospital = await deleteHospitalServices(Number(id));

    // 📝 Log activity
    await registerActivityLogService({
      userId: (req as any).user?.id || null,
      actionType: "hospital_delete",
      description: `Deleted hospital with id: ${id}`,
      ipAddress: req.ip,
    });

    res.status(200).json({ message: deletedHospital });
  } catch (error: any) {
    res.status(500).json({
      error: error.message || "❌ Error Occurred While Deleting Hospital",
    });
  }
};

// ✏️ Update Hospital
export const updateHospital = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const hospitalUpdates = req.body;

    if (!id) {
      return res.status(400).json({ error: "⚠️ id is required" });
    }

    const updatedHospital = await updateHospitalServices(Number(id), hospitalUpdates);

    // 📝 Log activity
    await registerActivityLogService({
      userId: (req as any).user?.id || null,
      actionType: "hospital_update",
      description: `Updated hospital with id: ${id}`,
      ipAddress: req.ip,
    });

    res.status(200).json({ message: updatedHospital });
  } catch (error: any) {
    res.status(500).json({
      error: error.message || "❌ Error occurred while updating hospital",
    });
  }
};
