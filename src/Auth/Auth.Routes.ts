import { Router } from "express";
import { loginUser, RegisterUser } from "./Auth.controller";


const AuthRouter = Router();

// Create User
AuthRouter.post('/register', RegisterUser)

// Login User
AuthRouter.post('/login', loginUser);

export default AuthRouter;