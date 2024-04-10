import { Request, Response } from 'express';
import { AccountService } from '@services';
import jwt from "jsonwebtoken";

export class AccountController {
  private static instance: AccountController | null = null;

  private constructor() {}

  static getInstance(): AccountController {
    if (!AccountController.instance) {
      AccountController.instance = new AccountController();
    }

    return AccountController.instance;
  }

  register = async (req: Request, res: Response) => {
    try {
      const { username, email, password, role, bank_number, wallet, phone, fullname, hotel_name, hotel_address, description, image } = req.body;
      const user = await AccountService.getInstance().addAccount({ username, email, password, role, bank_number, wallet, phone, fullname, hotel_name, hotel_address, description, image });
      res.status(200).json(user);
    } catch (error) {
      const _error = error as Error;
      res.status(400).json({ message: _error.message });
    }
  };

  login = async (req: Request, res: Response) => {
    try {
      const { username, password } = req.body;
      const account = await AccountService.getInstance().getAccountByUsername(username);
      if (
        !account ||
        !(await AccountService.getInstance().comparePassword(password, account.password))
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
}
