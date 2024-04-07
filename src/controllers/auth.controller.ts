import { AuthService } from "@services";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";

class AuthController {
  private static instance: AuthController | null = null;

  private constructor() {}

  static getInstance(): AuthController {
    if (AuthController.instance === null) {
      AuthController.instance = new AuthController();
    }
    return AuthController.instance;
  }

  login = async (req: Request, res: Response) => {
    try {
      const { username, password } = req.body;
      const account = await AuthService.getInstance().getAccountByUsername(username);
      if (
        !account ||
        !(await AuthService.getInstance().comparePassword(password, account.password))
      ) {
        return res.status(401).json({ message: "Invalid username or password" });
      }
      const token = jwt.sign(
        { username: account.username, role: account.role },
        process.env.JWT_SECRET ?? "s3cr3t",
        { expiresIn: "1h" }
      );
      return res.status(200).json({ message: "Login successful", token });
    } catch (error) {
      const _error = error as Error;
      return res.status(500).json({ message: _error.message });
    }
  };

  hashPassword = async (req: Request, res: Response) => {
    try {
      const { password } = req.body;
      const hashedPassword = await AuthService.getInstance().hashPassword(password);
      return res.status(200).json({ hashedPassword });
    } catch (error) {
      const _error = error as Error;
      return res.status(500).json({ message: _error.message });
    }
  };
} 

export { AuthController }
