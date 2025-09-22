import { Request, Response } from "express";
import {
  getAllPenaltiesServices,
  getPenaltyByIdServices,
  registerPenaltyService,
  updatePenaltyServices,
  deletePenaltyServices,
} from "./Penalties.service";
import { registerActivityLogService } from "../ActivityLogs/ActivityLogs.service";

// 📜 Get All Penalties
export const getAllPenalties = async (req: Request, res: Response) => {
  try {
    const penalties = await getAllPenaltiesServices();
    if (!penalties || penalties.length === 0) {
      return res.status(404).json({ message: "⚠️ No penalties found" });
    }

    // 📝 Optional read logging
    // await registerActivityLogService({
    //   userId: (req as any).user?.id || null,
    //   actionType: "other",
    //   description: "Fetched all penalties",
    //   ipAddress: req.ip,
    // });

    res.status(200).json(penalties);
  } catch (error: any) {
    res.status(500).json({
      error: error.message || "❌ Error occurred while fetching penalties",
    });
  }
};

// 🔍 Get Penalty By ID
export const getPenaltyById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const penalty = await getPenaltyByIdServices(Number(id));
    if (!penalty) {
      return res.status(404).json({ message: "⚠️ Penalty not found" });
    }

    // 📝 Optional read logging
    // await registerActivityLogService({
    //   userId: (req as any).user?.id || null,
    //   actionType: "other",
    //   description: `Fetched penalty with id: ${id}`,
    //   ipAddress: req.ip,
    // });

    res.status(200).json(penalty);
  } catch (error: any) {
    res.status(500).json({
      error: error.message || "❌ Error occurred while fetching penalty",
    });
  }
};

// ➕ Register Penalty with automatic user deactivation
export const registerPenalty = async (req: Request, res: Response) => {
  try {
    const message = await registerPenaltyService(req.body);

    // 📝 Log activity
    await registerActivityLogService({
      userId: (req as any).user?.id || null,
      actionType: "penalty_create",
      description: `Created new penalty for user ${req.body.userId || "unknown"}`,
      ipAddress: req.ip,
    });

    res.status(201).json({ message });
  } catch (error: any) {
    res.status(500).json({
      error: error.message || "❌ Error occurred while creating penalty",
    });
  }
};

// ✏️ Update Penalty
export const updatePenalty = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const message = await updatePenaltyServices(Number(id), req.body);

    // 📝 Log activity
    await registerActivityLogService({
      userId: (req as any).user?.id || null,
      actionType: "penalty_update",
      description: `Updated penalty with id: ${id}`,
      ipAddress: req.ip,
    });

    res.status(200).json({ message });
  } catch (error: any) {
    res.status(500).json({
      error: error.message || "❌ Error occurred while updating penalty",
    });
  }
};

// 🗑️ Delete Penalty
export const deletePenalty = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const message = await deletePenaltyServices(Number(id));

    // 📝 Log activity
    await registerActivityLogService({
      userId: (req as any).user?.id || null,
      actionType: "penalty_delete",
      description: `Deleted penalty with id: ${id}`,
      ipAddress: req.ip,
    });

    res.status(200).json({ message });
  } catch (error: any) {
    res.status(500).json({
      error: error.message || "❌ Error occurred while deleting penalty",
    });
  }
};
