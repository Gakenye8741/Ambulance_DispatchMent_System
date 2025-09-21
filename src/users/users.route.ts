import { Router } from "express";
import { 
  deleteUser, 
  getAllUsers, 
  updateUser, 
  getUserByNationalId 
} from "./users.controller";

const userRoutes = Router();

// 👥 Get All Users
userRoutes.get("/allUsers", getAllUsers);

// 🔍 Get User By National ID
userRoutes.get("/:nationalId", getUserByNationalId);

// 🗑️ Delete User
userRoutes.delete("/deleteUser/:nationalId", deleteUser);

// ✏️ Update User (by nationalId → can change fullName, phone, password)
userRoutes.put("/updateUser/:nationalId", updateUser);

export default userRoutes;
