import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export class AuthMiddleware {
  private static instance: AuthMiddleware | null = null;

  private constructor() {}

  static getInstance(): AuthMiddleware {
    if (AuthMiddleware.instance === null) {
      AuthMiddleware.instance = new AuthMiddleware();
    }
    return AuthMiddleware.instance;
  }

  authenticate = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "No provided token" });
    }

    try {
      const decoded = jwt.verify(
        token,
        process.env.TOKEN_SECRET || "default_jwt_secret"
      ) as { user: any };
      req.user = decoded.user;
      next();

      return;
    } catch (error) {
      const _error = error as Error;
      return res
        .status(401)
        .json({ message: `Token verify error: ${_error.message}` });
    }
  };
}
