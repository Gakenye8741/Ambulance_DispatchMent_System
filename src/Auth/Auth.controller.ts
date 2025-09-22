import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { getUserByEmailService, registerUserService } from "./Auth.service";
import { registerActivityLogService } from "../Services/ActivityLogs/ActivityLogs.service";

const JWT_SECRET = process.env.JWT_SECRET!;
if (!JWT_SECRET) throw new Error("JWT_SECRET not defined");

export const RegisterUser = async (req: Request, res: Response) => {
  try {
    const { fullName, email, passwordHash, nationalId, phone, role } = req.body;
    if (!fullName || !email || !passwordHash || !nationalId || !phone) {
      return res.status(400).json({ error: "All fields are required!" });
    }

    const hashedPassword = await bcrypt.hash(passwordHash, 10);

    const newUser = await registerUserService({
      fullName,
      email,
      passwordHash: hashedPassword,
      nationalId,
      phone,
      role: role || "patient",
    });

    // 📝 Log activity
    await registerActivityLogService({
      userId: newUser.id,
      actionType: "user_create",
      description: `New user registered: ${fullName} (${email})`,
      ipAddress: req.ip,
    });

    res.status(201).json({ message: "User registered", user: newUser });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, passwordHash } = req.body;
    if (!email || !passwordHash) return res.status(400).json({ error: "Email & password required" });

    const user = await getUserByEmailService(email);
    if (!user) return res.status(404).json({ error: "User not found" });

    const isMatch = await bcrypt.compare(passwordHash, user.passwordHash);
    if (!isMatch) return res.status(401).json({ error: "Invalid password" });

    const payload = {
      id: user.id,
      nationalId: user.nationalId,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      role: user.role,
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "2h" });

    // 📝 Log activity
    await registerActivityLogService({
      userId: user.id,
      actionType: "login",
      description: `User logged in: ${user.fullName} (${user.email})`,
      ipAddress: req.ip,
    });

    res.status(200).json({ message: "Login successful", token, user: payload });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
