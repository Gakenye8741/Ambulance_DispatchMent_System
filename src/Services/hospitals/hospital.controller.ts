import { Request, Response } from "express";
import {
  deleteHospitalServices,
  getAllHospitalsServices,
  updateHospitalServices,
  getHospitalByIdServices,
  registerHospitalService
} from "./hospital.service";

// 🏥 Get All Hospitals
export const getAllHospitals = async (req: Request, res: Response) => {
  try {
    const allHospitals = await getAllHospitalsServices();
    if (!allHospitals || allHospitals.length === 0) {
      res.status(400).json({ message: "⚠️ No hospitals found" });
    } else {
      res.status(200).json({ allHospitals });
    }
  } catch (error: any) {
    res.status(500).json({
      error: error.message || "❌ Error Occurred While Fetching Hospitals",
    });
  }
};

// 🔍 Get Hospital By ID
export const getHospitalById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({ error: "⚠️ id is required" });
      return;
    }

    const hospital = await getHospitalByIdServices(Number(id));
    if (!hospital) {
      res.status(404).json({ error: "❌ Hospital not found" });
      return;
    }

    res.status(200).json({ hospital });
  } catch (error: any) {
    res.status(500).json({
      error: error.message || "❌ Error Occurred While Fetching Hospital",
    });
  }
};

// ➕ Register Hospital
export const registerHospital = async (req: Request, res: Response) => {
  try {
    const hospitalData = req.body;
    const message = await registerHospitalService(hospitalData);
    res.status(201).json({ message });
  } catch (error: any) {
    res.status(500).json({
      error: error.message || "❌ Error Occurred While Creating Hospital",
    });
  }
};

// 🗑️ Delete Hospital
export const deleteHospital = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({ error: "⚠️ id is required" });
      return;
    }

    const deletedHospital = await deleteHospitalServices(Number(id));
    res.status(200).json({ message: deletedHospital });
  } catch (error: any) {
    res.status(500).json({
      error: error.message || "❌ Error Occurred While Deleting Hospital",
    });
  }
};

// ✏️ Update Hospital
export const updateHospital = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const hospitalUpdates = req.body;

    if (!id) {
      res.status(400).json({ error: "⚠️ id is required" });
      return;
    }

    const updatedHospital = await updateHospitalServices(Number(id), hospitalUpdates);
    res.status(200).json({ message: updatedHospital });
  } catch (error: any) {
    res.status(500).json({
      error: error.message || "❌ Error occurred while updating hospital",
    });
  }
};
