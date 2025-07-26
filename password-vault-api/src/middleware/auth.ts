import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthenticatedRequest extends Request {
  userId?: string;
  username?: string;
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      res.status(401).json({ error: 'Access denied. No token provided.' });
      return;
    }

    const jwtSecret = process.env.JWT_SECRET || 'fallback-secret-key';
    const decoded = jwt.verify(token, jwtSecret) as { userId: string; username: string };

    (req as AuthenticatedRequest).userId = decoded.userId;
    (req as AuthenticatedRequest).username = decoded.username;
    
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token.' });
  }
};
