import { Request, Response } from 'express';
import { AccountService } from '@services';
import jwt from "jsonwebtoken";
import passport from 'passport';

export class AccountController {
  private static instance: AccountController | null = null;

  private constructor() { }

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
    passport.authenticate("local", (err: Error, user: any, info: any) => {
      if (err) {
        return res.status(500).json({ message: err.message });
      }
      if (!user) {
        return res.status(401).json({ message: info.message });
      }
      req.logIn(user, (err) => {
        if (err) {
          return res.status(500).json({ message: err.message });
        }
        user.password = "*****";
        const token = jwt.sign(
          { user },
          process.env.TOKEN_SECRET || "default_jwt_secret",
          { expiresIn: "1h" },
        );

        return res.status(200).json({ message: "Login successfully", data: { token, account: user } });
      });

      return;
    })(req, res);
  };

  update = async (req: Request, res: Response) => {
    try {
      const { username, email, password, role, bank_number, wallet, phone, fullname, hotel_name, hotel_address, description, image } = req.body;
      
      const user = await AccountService.getInstance().updateAccount({ username, email, password, role, bank_number, wallet, phone, fullname, hotel_name, hotel_address, description, image });
      res.status(200).json(user);
    } catch (error) {
      const _error = error as Error;
      res.status(400).json({ message: _error.message });
    }
  }
}