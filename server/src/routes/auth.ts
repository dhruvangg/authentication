import { Router, Request, Response } from "express";
import { login, register, profile, session } from "../controllers";
import { validateAuth } from "../middleware/validateAuth";

export const authRouter = Router();

authRouter.post("/register", register)
authRouter.post("/login", login);
authRouter.get("/session", session);
authRouter.get('/profile', validateAuth, profile);