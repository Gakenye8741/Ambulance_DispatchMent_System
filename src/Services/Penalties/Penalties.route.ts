import { Router } from "express";
import {
  getAllPenalties,
  getPenaltyById,
  registerPenalty,
  updatePenalty,
  deletePenalty,
} from "./Penalties.controller";

const penaltiesRoutes = Router();

// Get all penalties
penaltiesRoutes.get("/all", getAllPenalties);

// Get penalty by ID
penaltiesRoutes.get("/:id", getPenaltyById);

// Register a new penalty
penaltiesRoutes.post("/register", registerPenalty);

// Update a penalty
penaltiesRoutes.put("/update/:id", updatePenalty);

// Delete a penalty
penaltiesRoutes.delete("/delete/:id", deletePenalty);

export default penaltiesRoutes;
