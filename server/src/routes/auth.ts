import { Router, Request, Response } from "express";
import { login, register } from "../controllers";
import { validateAuth } from "../middleware/validateAuth";

export const authRouter = Router();

authRouter.post("/register", register)
authRouter.post("/login", login);
authRouter.get('/protected', validateAuth, (req, res) => {
    res.send('You accessed protected route!');
});