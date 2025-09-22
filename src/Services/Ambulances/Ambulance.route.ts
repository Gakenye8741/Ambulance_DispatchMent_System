import { Router } from "express";
import {
  registerAmbulance,
  getAllAmbulances,
  getAmbulanceById,
  updateAmbulance,
  deleteAmbulance,
} from "./Ambulances.controller";
import { anyAuthenticatedUser, HospitalAdminAuth, SystemAdminAuth } from "../../middlewares/bearAuth";

const ambulanceRoutes = Router();

// 🚑 ➕ Register Ambulance
ambulanceRoutes.post("/register",HospitalAdminAuth, registerAmbulance);

// 🚑 👥 Get All Ambulances
ambulanceRoutes.get("/all",anyAuthenticatedUser, getAllAmbulances);

// 🚑 🔍 Get Ambulance by ID
ambulanceRoutes.get("/:id",anyAuthenticatedUser, getAmbulanceById);

// 🚑 ✏️ Update Ambulance
ambulanceRoutes.put("/update/:id",HospitalAdminAuth, updateAmbulance);

// 🚑 🗑️ Delete Ambulance
ambulanceRoutes.delete("/delete/:id",HospitalAdminAuth, deleteAmbulance);

export default ambulanceRoutes;
