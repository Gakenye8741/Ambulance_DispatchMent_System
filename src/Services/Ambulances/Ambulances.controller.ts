import { Request, Response } from "express";
import {
  registerAmbulanceService,
  getAllAmbulancesService,
  getAmbulanceByIdService,
  updateAmbulanceService,
  deleteAmbulanceService,
} from "./Ambulances.service";
import { registerActivityLogService } from "../ActivityLogs/ActivityLogs.service";

const logActivity = async (req: Request, description: string) => {
  if (!req.user) return;
  await registerActivityLogService({
    userId: req.user.id, // must match users.id FK
    actionType: "trip_update",
    description,
    ipAddress: req.ip,
    createdAt: new Date(),
  });
};

export const registerAmbulance = async (req: Request, res: Response) => {
  try {
    const ambulance = req.body;
    const message = await registerAmbulanceService(ambulance);
    await logActivity(req, `Registered ambulance plate ${ambulance.plateNumber}`);
    res.status(201).json({ message });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllAmbulances = async (req: Request, res: Response) => {
  try {
    const ambulances = await getAllAmbulancesService();
    if (!ambulances?.length) return res.status(404).json({ message: "No ambulances found" });
    res.status(200).json({ ambulances });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getAmbulanceById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ error: "Ambulance ID required" });

    const ambulance = await getAmbulanceByIdService(id);
    if (!ambulance) return res.status(404).json({ error: "Ambulance not found" });

    res.status(200).json({ ambulance });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateAmbulance = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const updates = req.body;
    if (!id) return res.status(400).json({ error: "Ambulance ID required" });

    const message = await updateAmbulanceService(id, updates);
    await logActivity(req, `Updated ambulance ID ${id}: ${JSON.stringify(updates)}`);

    res.status(200).json({ message });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteAmbulance = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ error: "Ambulance ID required" });

    const message = await deleteAmbulanceService(id);
    await logActivity(req, `Deleted ambulance ID ${id}`);

    res.status(200).json({ message });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
