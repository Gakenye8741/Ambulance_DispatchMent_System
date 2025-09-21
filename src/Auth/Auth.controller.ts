import { Request, Response } from "express";
import bcrypt, { compareSync } from "bcrypt";
import jwt from "jsonwebtoken";
import { getUserByEmailService, registerUserService } from "./Auth.service";

export const RegisterUser = async (req: Request, res: Response) => {
  try {
    const user = req.body;

    console.log(`Unhashed password: ${user.passwordHash}`);

    if (!user.fullName || !user.email || !user.passwordHash || !user.nationalId || !user.phone) {
      return res.status(400).json({ error: "All Fields Are Required!!!" });
    }

    // Hash Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(user.passwordHash, salt);
    user.passwordHash = hashedPassword;

    // Save user to DB
    const newUser = await registerUserService(user);

    if (!newUser) {
      return res.status(400).json({ error: "User not registered. Error occurred!" });
    }

    return res.status(201).json({ message: newUser });

  } catch (error: any) {
    return res.status(500).json({ error: error.message || "Error occurred. Try again." });
  }
};

// Logic for Logging In

export const loginUser = async (req:Request ,res:Response)=>{
  try {
    const user = req.body;
    // Checking if the email used to login exists in the database
    const existingUser  =  await getUserByEmailService(user.email);
    if(!existingUser){
      res.status(404).json({error: "No User Found with that Email!!!"});
      return;
    }

    // Comparing Passwords
    const isMatch = bcrypt.compareSync(user.passwordHash, existingUser.passwordHash);
    if(!isMatch){
      res.status(404).json({error: "Invalid Password!!"})
      return;
    }

    //  generating  token
    //  generating token
const payload = {
  fullName: existingUser.fullName,
  nationalId: existingUser.nationalId,
  email: existingUser.email,
  phone: existingUser.phone,
  status: existingUser.status,
  role: existingUser.role
};

let secret = process.env.JWT_SECRET;
if (!secret) {
  throw new Error("JWT_SECRET is not defined in environment variables");
}

// Token expires in 2 hours
let token = jwt.sign(payload, secret, { expiresIn: "2h" });

res.status(200).json({
  token,
  fullName: existingUser.fullName,
  nationalId: existingUser.nationalId,
  status: existingUser.status,
  phone: existingUser.phone,
  email: existingUser.email,
  role: existingUser.role,
  createdAt: existingUser.createdAt
});

  } catch (error:any) {
    res.status(400).json({error: error.message || "Error Occurred Try Again"});
  }
}
