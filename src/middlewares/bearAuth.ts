// Token
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { userRoleEnum } from "../drizzle/schema";

dotenv.config();

// JWT payload type
type DecodedToken = {
  username: string;
  nationalId: number;
  email: string;
  role: typeof userRoleEnum.enumValues[number]; // 'patient' | 'ambulance_driver' | 'hospital_admin' | 'system_admin'
  firstName: string;
  lastName: string;
  exp: number;
};

// Extend Express Request with user payload
declare global {
  namespace Express {
    interface Request {
      user?: DecodedToken;
    }
  }
}

// Token verification helper
export const verifyToken = async (
  token: string,
  secret: string
): Promise<DecodedToken | null> => {
  try {
    const decoded = jwt.verify(token, secret) as DecodedToken;
    return decoded;
  } catch (error) {
    return null;
  }
};

// Auth middleware factory with correct return type
export const authMiddleware = (
  requiredRole:
    | typeof userRoleEnum.enumValues[number]
    | "any"
    | "medical_staff" // custom group for hospital_admin + ambulance_driver
): ((req: Request, res: Response, next: NextFunction) => Promise<void>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      res.status(401).json({ error: "Authorization header is missing" });
      return;
    }

    const decodedToken = await verifyToken(
      token,
      process.env.JWT_SECRET as string
    );

    if (!decodedToken) {
      res.status(401).json({ error: "Invalid or expired token" });
      return;
    }

    const userType = decodedToken.role;

    // Check access
    if (
      requiredRole === "any" ||
      userType === requiredRole ||
      (requiredRole === "medical_staff" &&
        (userType === "hospital_admin" || userType === "ambulance_driver"))
    ) {
      req.user = decodedToken;
      next();
    } else {
      res.status(403).json({
        error: "Forbidden: You do not have permission to access this resource",
      });
    }
  };
};

// Role-based middleware exports
export const PatientAuth = authMiddleware("patient");
export const AmbulanceDriverAuth = authMiddleware("ambulance_driver");
export const HospitalAdminAuth = authMiddleware("hospital_admin");
export const SystemAdminAuth = authMiddleware("system_admin");

// Custom grouped middleware
export const MedicalStaffAuth = authMiddleware("medical_staff"); // hospital_admin + ambulance_driver

// Any authenticated user
export const anyAuthenticatedUser = authMiddleware("any");
