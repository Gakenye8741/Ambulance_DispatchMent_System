import { Router } from "express";
import {
  getAllHospitalAdmins,
  getHospitalAdminById,
  registerHospitalAdmin,
  updateHospitalAdmin,
  deleteHospitalAdmin,
} from "./hospitalAdmin.controller";

const hospitalAdminRoutes = Router();

// 👥 Get All Hospital Admins
hospitalAdminRoutes.get("/all", getAllHospitalAdmins);

// 🔍 Get Hospital Admin by ID
hospitalAdminRoutes.get("/:id", getHospitalAdminById);

// ➕ Register Hospital Admin
hospitalAdminRoutes.post("/register", registerHospitalAdmin);

// ✏️ Update Hospital Admin
hospitalAdminRoutes.put("/update/:id", updateHospitalAdmin);

// 🗑️ Delete Hospital Admin
hospitalAdminRoutes.delete("/delete/:id", deleteHospitalAdmin);

export default hospitalAdminRoutes;
