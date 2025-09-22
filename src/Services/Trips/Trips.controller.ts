import { Request, Response } from "express";
import {
  getAllTripsServices,
  getTripByIdServices,
  registerTripService,
  updateTripServices,
  deleteTripServices,
  cancelTripService,
} from "./Trips.service";
import { registerActivityLogService } from "../ActivityLogs/ActivityLogs.service";

// 🚑 Get All Trips
export const getAllTrips = async (req: Request, res: Response) => {
  try {
    const trips = await getAllTripsServices();
    if (!trips || trips.length === 0) {
      return res.status(404).json({ message: "⚠️ No trips found" });
    }

    // 📝 Optional logging (only if you want read logs)
    // await registerActivityLogService({
    //   userId: (req as any).user?.id || null,
    //   actionType: "trip_read",
    //   description: "Fetched all trips",
    //   ipAddress: req.ip,
    // });

    res.status(200).json(trips);
  } catch (error: any) {
    res.status(500).json({
      error: error.message || "❌ Error occurred while fetching trips",
    });
  }
};

// 🔍 Get Trip By ID
export const getTripById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const trip = await getTripByIdServices(Number(id));
    if (!trip) {
      return res.status(404).json({ message: "⚠️ Trip not found" });
    }

    // 📝 Optional logging for read
    // await registerActivityLogService({
    //   userId: (req as any).user?.id || null,
    //   actionType: "trip_read",
    //   description: `Fetched trip with id: ${id}`,
    //   ipAddress: req.ip,
    // });

    res.status(200).json(trip);
  } catch (error: any) {
    res.status(500).json({
      error: error.message || "❌ Error occurred while fetching trip",
    });
  }
};

// ➕ Register Trip
export const registerTrip = async (req: Request, res: Response) => {
  try {
    const message = await registerTripService(req.body);

    // 📝 Log activity
    await registerActivityLogService({
      userId: (req as any).user?.id || null,
      actionType: "trip_create",
      description: "New trip registered",
      ipAddress: req.ip,
    });

    res.status(201).json({ message });
  } catch (error: any) {
    res.status(500).json({
      error: error.message || "❌ Error occurred while creating trip",
    });
  }
};

// ✏️ Update Trip
export const updateTrip = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const message = await updateTripServices(Number(id), req.body);

    // 📝 Log activity
    await registerActivityLogService({
      userId: (req as any).user?.id || null,
      actionType: "trip_update",
      description: `Updated trip with id: ${id}`,
      ipAddress: req.ip,
    });

    res.status(200).json({ message });
  } catch (error: any) {
    res.status(500).json({
      error: error.message || "❌ Error occurred while updating trip",
    });
  }
};

// 🗑️ Delete Trip
export const deleteTrip = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const message = await deleteTripServices(Number(id));

    // 📝 Log activity
    await registerActivityLogService({
      userId: (req as any).user?.id || null,
      actionType: "trip_delete",
      description: `Deleted trip with id: ${id}`,
      ipAddress: req.ip,
    });

    res.status(200).json({ message });
  } catch (error: any) {
    res.status(500).json({
      error: error.message || "❌ Error occurred while deleting trip",
    });
  }
};

// ❌ Cancel Trip (soft update)
export const cancelTrip = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const message = await cancelTripService(Number(id));

    // 📝 Log activity
    await registerActivityLogService({
      userId: (req as any).user?.id || null,
      actionType: "trip_cancel",
      description: `Cancelled trip with id: ${id}`,
      ipAddress: req.ip,
    });

    res.status(200).json({ message });
  } catch (error: any) {
    res.status(500).json({
      error: error.message || "❌ Error occurred while cancelling trip",
    });
  }
};
