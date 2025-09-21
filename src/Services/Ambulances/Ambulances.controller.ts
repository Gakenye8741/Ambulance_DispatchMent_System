import { Request, Response } from "express";
import {
  registerAmbulanceService,
  getAllAmbulancesService,
  getAmbulanceByIdService,
  updateAmbulanceService,
  deleteAmbulanceService,
} from "./Ambulances.service";

import { logActivity } from "../ActivityLogs/ActivityLogs.service";

// 🚑 ➕ Register Ambulance
export const registerAmbulance = async (req: Request, res: Response) => {
  try {
    const ambulance = req.body;
    const message = await registerAmbulanceService(ambulance);

    // Log activity
    await logActivity(
      req.body.userId || null,
      "CREATE",
      `Registered ambulance with plate number ${ambulance.plateNumber}`,
      req.ip
    );

    res.status(201).json({ message });
  } catch (error: any) {
    res.status(500).json({
      error: error.message || "❌ Error occurred while registering ambulance",
    });
  }
};

// 🚑 👥 Get All Ambulances
export const getAllAmbulances = async (req: Request, res: Response) => {
  try {
    const ambulances = await getAllAmbulancesService();
    if (!ambulances || ambulances.length === 0) {
      return res.status(404).json({ message: "⚠️ No ambulances found" });
    }

    await logActivity(
      req.body.userId || null,
      "READ",
      `Fetched all ambulances`,
      req.ip
    );

    res.status(200).json({ ambulances });
  } catch (error: any) {
    res.status(500).json({
      error: error.message || "❌ Error occurred while fetching ambulances",
    });
  }
};

// 🚑 🔍 Get Ambulance by ID
export const getAmbulanceById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ error: "⚠️ Ambulance ID is required" });

    const ambulance = await getAmbulanceByIdService(Number(id));
    if (!ambulance) return res.status(404).json({ error: "❌ Ambulance not found" });

    await logActivity(
      req.body.userId || null,
      "READ",
      `Fetched ambulance with ID ${id}`,
      req.ip
    );

    res.status(200).json({ ambulance });
  } catch (error: any) {
    res.status(500).json({
      error: error.message || "❌ Error occurred while fetching ambulance",
    });
  }
};

// 🚑 ✏️ Update Ambulance
export const updateAmbulance = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    if (!id) return res.status(400).json({ error: "⚠️ Ambulance ID is required" });

    const message = await updateAmbulanceService(Number(id), updates);

    await logActivity(
      req.body.userId || null,
      "UPDATE",
      `Updated ambulance with ID ${id}`,
      req.ip
    );

    res.status(200).json({ message });
  } catch (error: any) {
    res.status(500).json({
      error: error.message || "❌ Error occurred while updating ambulance",
    });
  }
};

// 🚑 🗑️ Delete Ambulance
export const deleteAmbulance = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ error: "⚠️ Ambulance ID is required" });

    const message = await deleteAmbulanceService(Number(id));

    await logActivity(
      req.body.userId || null,
      "DELETE",
      `Deleted ambulance with ID ${id}`,
      req.ip
    );

    res.status(200).json({ message });
  } catch (error: any) {
    res.status(500).json({
      error: error.message || "❌ Error occurred while deleting ambulance",
    });
  }
};
