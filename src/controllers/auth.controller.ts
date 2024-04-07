import { authService } from "@services/auth.service";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";

const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    const account = await authService.getAccountByUsername(username);
    if (
      !account ||
      !(await authService.comparePassword(password, account.password))
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

const hashPassword = async (req: Request, res: Response) => {
  try {
    const { password } = req.body;
    const hashedPassword = await authService.hashPassword(password);
    return res.status(200).json({ hashedPassword });
  } catch (error) {
    const _error = error as Error;
    return res.status(500).json({ message: _error.message });
  }
};

export const authController = { login, hashPassword };
