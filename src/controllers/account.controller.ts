import { AccountService, OTPService } from "@services";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import passport from "passport";
import otpGenerator from "otp-generator";

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
      const role = req.body.role || "";

      if (role !== "customer" && role !== "moderator") {
        throw new Error("Role must be customer or moderator");
      }

      let result;

      if (role === "customer") {
        const { username, email, password, phone, fullname, role } = req.body;

        result = await AccountService.getInstance().addAccount({ 
          username, 
          email, 
          password, 
          role, 
          bank_number: "123123", 
          wallet: 0, 
          phone, 
          fullname, 
          hotel_name: null, 
          hotel_address: null, 
          description: null, 
          image: null 
        });
      } else {
        const { username, email, password, phone, fullname, hotelName, hotelAddress, description, role } = req.body;

        result = await AccountService.getInstance().addAccount({ 
          username, 
          email, 
          password, 
          role, 
          bank_number: "123123", 
          wallet: 0, 
          phone, 
          fullname, 
          hotel_name: hotelName, 
          hotel_address: hotelAddress, 
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
      else {
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
      }
      try {
        req.logIn(user, (err) => {
          if (err) {
            return res.status(500).json({ message: err.message });
          }
          user.password = "*****";
          const token = jwt.sign(
            { user },
            process.env.TOKEN_SECRET ?? "default_jwt_secret",
            { expiresIn: "10d" }
          );

          return res
            .status(200)
            .json({
              message: "Login successfully",
              data: { token, account: user },
            });
        });
      } catch (error) {
        return res.status(500).json({ message: "Something went wrong" });
      }
    })(req, res);
  };

  update = async (req: Request, res: Response) => {
    try {
      const {
        username,
        email,
        password,
        role,
        bank_number,
        wallet,
        phone,
        fullname,
        hotel_name,
        hotel_address,
        description,
        image,
      } = req.body;

      const user = await AccountService.getInstance().updateAccount({
        username,
        email,
        password,
        role,
        bank_number,
        wallet,
        phone,
        fullname,
        hotel_name,
        hotel_address,
        description,
        image,
      });
      res.status(200).json(user);
    } catch (error) {
      const _error = error as Error;
      res.status(400).json({ message: _error.message });
    }
  };

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

      const data = moderators.map((moderator) => {
        return {
          _id: moderator._id,
          username: moderator.username,
          email: moderator.email,
          role: moderator.role,
          bankNumber: moderator.bank_number,
          wallet: moderator.wallet,
          phone: moderator.phone,
          fullname: moderator.fullname,
          hotelName: moderator.hotel_name,
          hotelAddress: moderator.hotel_address,
          description: moderator.description,
          image: moderator.image,
        };
      });

      res.status(200).json({ data });
    } catch (error) {
      const _error = error as Error;
      res.status(400).json({ message: _error.message });
    }
  };

  forgotPassword = async (req: Request, res: Response) => {
    try {
      const username = req.body.username;
      const user = await AccountService.getInstance().getAccountByUsername(
        username
      );

      if (!user) {
        res.status(400).json({ message: "Username does not exist" });
      } else {
        const otp = otpGenerator.generate(6, { digits: true, lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false });
        await OTPService.getInstance().sendOTP(user.email, otp);
        res.status(200).json({ message: "OTP has been sent" });
      }
    } catch (error) {
      const _error = error as Error;
      res.status(400).json({ message: _error.message });
    }
  };

  verifyOTP = async (req: Request, res: Response) => {
    try {
      const username = req.body.username;
      const otp = req.body.otp;

      const user = await AccountService.getInstance().getAccountByUsername(
        username
      );

      if (!user) {
        res.status(400).json({ message: "Username does not exist" });
      } else {
        const otpData = await OTPService.getInstance().getOTP(user.email);

        if (otpData && otpData.otp === otp) {
          res.status(200).json({ message: "OTP is valid" });
        } else {
          res.status(400).json({ message: "Invalid OTP" });
        }
      }
    } catch (error) {
      const _error = error as Error;
      res.status(400).json({ message: _error.message });
    }
  };

  resetPassword = async (req: Request, res: Response) => {
    try {
      const username = req.body.username;
      const password = req.body.password;

      const user = await AccountService.getInstance().getAccountByUsername(
        username
      );

      if (!user) {
        res.status(400).json({ message: "Username does not exist" });
      } else {
        await AccountService.getInstance().updatePassword(username, password);
        res.status(200).json({ message: "Password has been updated" });
      }
    } catch (error) {
      const _error = error as Error;
      res.status(400).json({ message: _error.message });
    }
  }
}
