import { Request, Response } from "express";
import {
  createEmergencyRequestService,
  getAllEmergencyRequestsService,
  getEmergencyRequestByIdService,
  updateEmergencyRequestService,
  deleteEmergencyRequestService,
} from "./EmergencyServices.service";

// ➕ Create Emergency Request
export const createEmergencyRequest = async (req: Request, res: Response) => {
  try {
    const requestData = req.body;
    if (!requestData.patientId || !requestData.emergencyLevel || !requestData.latitude || !requestData.longitude) {
      res.status(400).json({ error: "⚠️ Missing required fields: patientId, emergencyLevel, latitude, longitude" });
      return;
    }

    const message = await createEmergencyRequestService(requestData);
    res.status(201).json({ message });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "❌ Failed to create emergency request" });
  }
};

// 👥 Get All Emergency Requests
export const getAllEmergencyRequests = async (req: Request, res: Response) => {
  try {
    const requests = await getAllEmergencyRequestsService();
    if (!requests || requests.length === 0) {
      res.status(404).json({ message: "⚠️ No emergency requests found" });
      return;
    }
    res.status(200).json({ requests });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "❌ Failed to fetch emergency requests" });
  }
};

// 🔍 Get Emergency Request By ID
export const getEmergencyRequestById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({ error: "⚠️ Request ID is required" });
      return;
    }

    const request = await getEmergencyRequestByIdService(Number(id));
    if (!request) {
      res.status(404).json({ error: "❌ Emergency request not found" });
      return;
    }

    res.status(200).json({ request });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "❌ Failed to fetch emergency request" });
  }
};

// ✏️ Update Emergency Request
export const updateEmergencyRequest = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (!id) {
      res.status(400).json({ error: "⚠️ Request ID is required" });
      return;
    }

    const message = await updateEmergencyRequestService(Number(id), updates);
    res.status(200).json({ message });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "❌ Failed to update emergency request" });
  }
};

// 🗑️ Delete Emergency Request
export const deleteEmergencyRequest = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({ error: "⚠️ Request ID is required" });
      return;
    }

    const message = await deleteEmergencyRequestService(Number(id));
    res.status(200).json({ message });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "❌ Failed to delete emergency request" });
  }
};
