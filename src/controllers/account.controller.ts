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
      
      const role = req.body.role || "";
      
      if (role !== "customer" && role !== "moderator") {
        throw new Error("Role must be customer or moderator");
      }

      let result;

      if (role === "customer") {
        const { username, password, fullname, role } = req.body;

        result = await AccountService.getInstance().addAccount({ 
          username, 
          email: "none@gmail.com", 
          password, 
          role, 
          bank_number: "", 
          wallet: 0, 
          phone: "", 
          fullname, 
          hotel_name: null, 
          hotel_address: null, 
          description: null, 
          image: null 
        });
      } else {
        const { username, password, hotel_name, hotel_address, description, role } = req.body;

        result = await AccountService.getInstance().addAccount({ 
          username, 
          email: "none@gmail.com", 
          password, 
          role, 
          bank_number: "", 
          wallet: 0, 
          phone: "", 
          fullname: null, 
          hotel_name, 
          hotel_address, 
          description, 
          image: null
        });
      }
      
      res.status(200).json({ message: "Register successfully", data: result });
    } catch (error) {
      const _error = error as Error;
      res.status(400).json({ message: _error.message });
    }
  };

  login = async (req: Request, res: Response) => {
    passport.authenticate("local", (err: Error, user: any, info: any) => {
      if (err) {
        res.status(500).json({ message: err.message });
      }
      if (!user) {
        res.status(401).json({ message: info.message });
      }
      req.logIn(user, (err) => {
        if (err) {
          res.status(500).json({ message: err.message });
        }
        user.password = "*****";
        const token = jwt.sign(
          { user },
          process.env.TOKEN_SECRET ?? "default_jwt_secret",
          { expiresIn: "10d" },
        );

        res.status(200).json({ message: "Login successfully", data: { token, account: user } });
      });
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

  delete = async (req: Request, res: Response) => {
    try {
      const account_id = req.body._id;
      const user = await AccountService.getInstance().deleteAccount(account_id);
      res.status(200).json(user);
    } catch (error) {
      const _error = error as Error;
      res.status(400).json({ message: _error.message });
    }
  };

  getModerators = async (_: Request, res: Response) => {
    try {
      const moderators = await AccountService.getInstance().getModerators();

      res.status(200).json({ data: moderators });
    } catch (error) {
      const _error = error as Error;
      res.status(400).json({ message: _error.message });
    }
  };

  getModerator = async (req: Request, res: Response) => {
    try {
      const hotel_id = req.params.hotel_id;
      const moderator = await AccountService.getInstance().getModerator(hotel_id);

      res.status(200).json({ data: moderator });
    } catch (error) {
      const _error = error as Error;
      res.status(400).json({ message: _error.message });
    }
  };
}