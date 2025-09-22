import { Request, Response } from "express";
import {
  createEmergencyRequestService,
  getAllEmergencyRequestsService,
  getEmergencyRequestByIdService,
  updateEmergencyRequestService,
  deleteEmergencyRequestService,
} from "./EmergencyServices.service";
import { registerActivityLogService } from "../ActivityLogs/ActivityLogs.service";

// 📝 Activity Log Helper
const logActivity = async (req: Request, description: string) => {
  if (!req.user) return; // requires req.user from auth middleware
  await registerActivityLogService({
    userId: req.user.id, // must match users.id FK
    actionType: "emergency_request_update",
    description,
    ipAddress: req.ip,
    createdAt: new Date(),
  });
};

// ➕ Create Emergency Request
export const createEmergencyRequest = async (req: Request, res: Response) => {
  try {
    const requestData = req.body;
    if (!requestData.patientId || !requestData.emergencyLevel || !requestData.latitude || !requestData.longitude) {
      return res.status(400).json({ error: "⚠️ Missing required fields: patientId, emergencyLevel, latitude, longitude" });
    }

    const message = await createEmergencyRequestService(requestData);
    await logActivity(req, `Created emergency request for patient ${requestData.patientId} at [${requestData.latitude}, ${requestData.longitude}]`);

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
      return res.status(404).json({ message: "⚠️ No emergency requests found" });
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
    if (!id) return res.status(400).json({ error: "⚠️ Request ID is required" });

    const request = await getEmergencyRequestByIdService(Number(id));
    if (!request) return res.status(404).json({ error: "❌ Emergency request not found" });

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

    if (!id) return res.status(400).json({ error: "⚠️ Request ID is required" });

    const message = await updateEmergencyRequestService(Number(id), updates);
    await logActivity(req, `Updated emergency request ID ${id}: ${JSON.stringify(updates)}`);

    res.status(200).json({ message });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "❌ Failed to update emergency request" });
  }
};

// 🗑️ Delete Emergency Request
export const deleteEmergencyRequest = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ error: "⚠️ Request ID is required" });

    const message = await deleteEmergencyRequestService(Number(id));
    await logActivity(req, `Deleted emergency request ID ${id}`);

    res.status(200).json({ message });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "❌ Failed to delete emergency request" });
  }
};
