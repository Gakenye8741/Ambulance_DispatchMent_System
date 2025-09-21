import { Router } from "express";
import {
  getAllTrips,
  getTripById,
  registerTrip,
  updateTrip,
  deleteTrip,
  cancelTrip,
} from "./Trips.controller";

const tripRoutes = Router();

// ➕ Register a Trip
tripRoutes.post("/register", registerTrip);

// 👥 Get All Trips
tripRoutes.get("/all", getAllTrips);

// 🔍 Get Trip by ID
tripRoutes.get("/:id", getTripById);

// ✏️ Update Trip (by ID)
tripRoutes.put("/update/:id", updateTrip);

// ❌ Cancel Trip (soft delete)
tripRoutes.put("/cancel/:id", cancelTrip);

// 🗑️ Delete Trip (hard delete)
tripRoutes.delete("/delete/:id", deleteTrip);

export default tripRoutes;
