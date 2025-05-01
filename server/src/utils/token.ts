import jwt from 'jsonwebtoken';

export const generateAccessToken = (data: object) => {    
    return jwt.sign(data, process.env.ACCESS_TOKEN_SECRET!, { expiresIn: '15m' });
};

export const generateRefreshToken = (data: object) => {
    return jwt.sign(data, process.env.REFRESH_TOKEN_SECRET!, { expiresIn: '7d' });
};
