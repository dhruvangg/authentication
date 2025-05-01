import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";

declare global {
    namespace Express {
        interface Request {
            user?: any;
        }
    }
}

export const validateAuth = (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies?.token || req.headers["authorization"]?.split(" ")[1];

    if (!token) {
        res.status(401).json({ message: "Unauthorized" });
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string, (err: any, decoded: any) => {
        if (err) {
            console.log(err.message);

            res.status(403).json({ message: "Forbidden" });
        }
        req.user = decoded;
        next();
    });
}