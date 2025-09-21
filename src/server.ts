// Imports
import express, { Application } from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";

import AuthRouter from "./Auth/Auth.Routes";
import { logger } from "./middlewares/logger";
import userRoutes from "./users/users.route";
import hospitalRoutes from "./Services/hospitals/hospital.route";
import hospitalAdminRoutes from "./Services/HospitalAdmins/hospitalAdmin.route";
import ambulanceRoutes from "./Services/Ambulances/Ambulance.route";
import emergencyRequestRoutes from "./Services/EmergencyServices/EmergencyServices.route";
import tripRoutes from "./Services/Trips/Trips.route";
import { dateParser } from "./middlewares/dateParser";
import PenaltiesRouter from "./Services/Penalties/Penalties.route";
import activityLogsRoutes from "./Services/ActivityLogs/ActivityLogs.route";

dotenv.config();

const PORT = process.env.PORT || 8000;
const App: Application = express();

// Middlewares
App.use(express.json());
App.use(express.urlencoded({ extended: true }));
App.use(cors());
App.use(helmet());
App.use(logger);
App.use(dateParser);

// Routes
App.use("/api/auth", AuthRouter);
App.use("/api/users", userRoutes);
App.use("/api/hospitals", hospitalRoutes);
App.use("/api/hospital-admins", hospitalAdminRoutes);
App.use("/api/ambulances/",ambulanceRoutes);
App.use("/api/emergency-requests/",emergencyRequestRoutes);
App.use("/api/trips/",tripRoutes);
App.use("/api/penalties/",PenaltiesRouter);
App.use("/api/activity-logs/",activityLogsRoutes);

// Default Message
App.get("/", (req, res) => {
  res.send("🚑 Welcome to the Backend of the Ambulance And Response System!!!");
});

// Global Error Handler
App.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message || "Something went wrong" });
});

// Start Server
App.listen(PORT, () => {
  console.log(`🚑 Backend running on http://localhost:${PORT}`);
});
