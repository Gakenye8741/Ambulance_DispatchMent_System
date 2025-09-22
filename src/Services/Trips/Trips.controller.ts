import { Request, Response } from "express";
import {
  getAllTripsServices,
  getTripByIdServices,
  registerTripService,
  updateTripServices,
  deleteTripServices,
  cancelTripService,
} from './Trips.service';

// 🚑 Get All Trips
export const getAllTrips = async (req: Request, res: Response) => {
  try {
    const trips = await getAllTripsServices();
    if (!trips || trips.length === 0) {
      res.status(404).json({ message: "⚠️ No trips found" });
      return;
    }
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
      res.status(404).json({ message: "⚠️ Trip not found" });
      return;
    }
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
    res.status(200).json({ message });
  } catch (error: any) {
    res.status(500).json({
      error: error.message || "❌ Error occurred while cancelling trip",
    });
  }
};
