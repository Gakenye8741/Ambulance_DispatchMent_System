import { Router } from "express";
import {
  getAllHospitals,
  getHospitalById,
  registerHospital,
  deleteHospital,
  updateHospital
} from "./hospital.controller";

const hospitalRoutes = Router();

// 🏥 Get All Hospitals
hospitalRoutes.get("/all", getAllHospitals);

// 🔍 Get Hospital By ID
hospitalRoutes.get("/:id", getHospitalById);

// ➕ Register Hospital
hospitalRoutes.post("/register", registerHospital);

// ✏️ Update Hospital (by ID)
hospitalRoutes.put("/update/:id", updateHospital);

// 🗑️ Delete Hospital (by ID)
hospitalRoutes.delete("/delete/:id", deleteHospital);

export default hospitalRoutes;
