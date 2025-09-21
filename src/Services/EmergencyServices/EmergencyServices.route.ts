import { Router } from "express";
import {
  createEmergencyRequest,
  getAllEmergencyRequests,
  getEmergencyRequestById,
  updateEmergencyRequest,
  deleteEmergencyRequest,
} from "./EmergencyServices.controller";

const emergencyRequestRoutes = Router();

// ➕ Create Emergency Request
emergencyRequestRoutes.post("/create", createEmergencyRequest);

// 👥 Get All Emergency Requests
emergencyRequestRoutes.get("/all", getAllEmergencyRequests);

// 🔍 Get Emergency Request by ID
emergencyRequestRoutes.get("/:id", getEmergencyRequestById);

// ✏️ Update Emergency Request
emergencyRequestRoutes.put("/update/:id", updateEmergencyRequest);

// 🗑️ Delete Emergency Request
emergencyRequestRoutes.delete("/delete/:id", deleteEmergencyRequest);

export default emergencyRequestRoutes;
