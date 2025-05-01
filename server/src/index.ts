import 'dotenv/config'
import jwt from 'jsonwebtoken';
import express, { Request, Response } from 'express'
import { authRouter } from './routes'
import mongoose from 'mongoose'
import cors from 'cors'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'

interface CustomRequest extends Request {
  cookies: { [key: string]: string };
}

const app = express()
const PORT = process.env.PORT || 3000

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined in the environment variables');
}

mongoose.connect(process.env.DATABASE_URL).then(() => {
  console.log('MongoDB connected');
}).catch((err) => {
  console.error('MongoDB connection error:', err);
});

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));
app.use(cookieParser())
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/', (_req, res) => {
  res.send('Hello, TypeScript + Express!')
})

app.use('/api/auth', authRouter)

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
