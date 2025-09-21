import { Router } from "express";
import {
  registerAmbulance,
  getAllAmbulances,
  getAmbulanceById,
  updateAmbulance,
  deleteAmbulance,
} from "./Ambulances.controller";

const ambulanceRoutes = Router();

// 🚑 ➕ Register Ambulance
ambulanceRoutes.post("/register", registerAmbulance);

// 🚑 👥 Get All Ambulances
ambulanceRoutes.get("/all", getAllAmbulances);

// 🚑 🔍 Get Ambulance by ID
ambulanceRoutes.get("/:id", getAmbulanceById);

// 🚑 ✏️ Update Ambulance
ambulanceRoutes.put("/update/:id", updateAmbulance);

// 🚑 🗑️ Delete Ambulance
ambulanceRoutes.delete("/delete/:id", deleteAmbulance);

export default ambulanceRoutes;
