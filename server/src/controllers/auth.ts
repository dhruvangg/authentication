import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User";
import { generateAccessToken, generateRefreshToken } from "../utils/token";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../utils/constants";

type RegisterRequestBody = {
    username: string;
    email: string;
    password: string;
    isActive: boolean;
}

type LoginRequestBody = {
    username: string;
    password: string;
}

const register = async (req: Request, res: Response) => {
    try {
        const { username, email, password, isActive } = req.body as RegisterRequestBody;
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({ username, email, password: hashedPassword, isActive });
        res.status(200).json(newUser);
    } catch (error) {
        res.status(500).json({ message: "Error fetching users" });
    }
}

const login = async (req: Request, res: Response) => {
    const { username, password } = req.body as LoginRequestBody;
    if (!username || !password) {
        res.status(400).json({ message: "Username and password are required" });
    }

    const user = await User.findOne({ username }) as {
        toObject(): { [x: string]: any; password: any; };
        save(): unknown;
        email: string; username: string, password?: string, lastLogin?: Date, refreshToken?: string
    };
    if (!user) {
        res.status(401).json({ message: "Invalid username or password" });
    }

    const isPasswordValid = user?.password && await bcrypt.compare(password, user.password as string);

    if (!isPasswordValid) {
        res.status(401).json({ message: "Invalid username or password" });
    }

    if (user) {
        user.lastLogin = new Date();
        await user.save();
        const { _id, username, email, isActive, lastLogin } = user.toObject();
        const accessToken = generateAccessToken({ id: _id, username, email, isActive, lastLogin });
        const refreshToken = generateRefreshToken({ id: _id, username, email, isActive, lastLogin });
        user.refreshToken = refreshToken;

        res.cookie(ACCESS_TOKEN, accessToken, {
            httpOnly: true,
            secure: false,
            path: "/",
            sameSite: "lax",
            maxAge: 15 * 60 * 1000, // 15 minutes
        })

        res.cookie(REFRESH_TOKEN, refreshToken, {
            httpOnly: true,
            secure: false,
            path: "/",
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days 
        })

        res.status(201).json({ message: "Login successful", user: { username, email, isActive, lastLogin } });
    }
}

const session = async (req: Request, res: Response) => {
    const accessToken = req.cookies[ACCESS_TOKEN];
    if (!accessToken) {
        res.status(401).json({ message: "Unauthorized" });
    }

    try {
        const payload = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET as string) as { id: string; username: string; email: string; isActive: boolean; lastLogin: Date };
        const user = await User.findById(payload.id) as { username: string; email: string; isActive: boolean; lastLogin: Date };
        if (!user) {
            res.status(401).json({ message: "Unauthorized" });
        }
        res.status(200).json({ user });
    } catch (error) {
        res.status(403).json({ message: "Invalid access token" });
    }
}

const RefreshToken = async (req: Request, res: Response) => {
    const { refreshToken } = req.body;
    if (!refreshToken) {
        res.status(401).json({ message: "Refresh token is required" });
    }

    try {
        const payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET as string) as { username: string };
        const newAccessToken = generateAccessToken(payload);

        res.cookie(ACCESS_TOKEN, newAccessToken, {
            httpOnly: true,
            secure: false,
            path: "/",
            sameSite: "lax",
            maxAge: 15 * 60 * 1000, // 15 minutes
        }).json({ message: "New access token generated" });

    } catch (error) {
        res.status(403).json({ message: "Invalid refresh token" });
    }
}

const logout = async (req: Request, res: Response) => {
    res.clearCookie(ACCESS_TOKEN, { path: "/" });
    res.clearCookie(REFRESH_TOKEN, { path: "/" });
    res.status(200).json({ message: "Logout successful" });
}

const profile = async (req: Request, res: Response) => {
    const user = req.user as { id: string; username: string; email: string; isActive: boolean; lastLogin: Date };
    if (!user) {
        res.status(401).json({ message: "Unauthorized" });
    }

    res.status(200).json({ user });
}
export { register, login, RefreshToken, session, logout, profile };