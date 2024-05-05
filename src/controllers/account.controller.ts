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

  hashPassword = async (req: Request, res: Response) => {
    try {
      const { password } = req.body;
      const hashedPassword = await AccountService.getInstance().hashPassword(password);
      res.status(200).json({ hashedPassword });
    } catch (error) {
      const _error = error as Error;
      res.status(400).json({ message: _error.message });
    }
  };

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
          const token = jwt.sign(
            { user },
            process.env.TOKEN_SECRET ?? "default_jwt_secret",
            { expiresIn: "10d" },
          );

          const _user = {
            _id: user._id,
            username: user.username,
            email: user.email,
            password: user.password,
            role: user.role,
            phone: user.phone,
            fullname: user.fullname,
            bankNumber: user.bank_number,
            wallet: user.wallet,
            hotelName: user.hotel_name,
            hotelAddress: user.hotel_address,
            description: user.description,
            image: user.image
          }
  
          res.status(200).json({ message: "Login successfully", data: { token, account: _user } });
        });
      }
    })(req, res);
  };

  update = async (req: Request, res: Response) => {
    try {
      const accountId = req.params.accountId;
      const updateUserInfo = req.body;

      const updatedUser = await AccountService.getInstance().updateAccount(accountId, updateUserInfo);
      res.status(200).json({ data: { user: updatedUser }, message: "Update successfully" });
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

  getModerators = async (req: Request, res: Response) => {
    try {
      const num = req.query.number ? parseInt(req.query.number as string) : 10;
      const start = req.query.start ? parseInt(req.query.start as string) : 0;
      const moderators = await AccountService.getInstance().getModerators(start, num);

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
  getProfile = async (req: Request, res: Response) => {
    try {
      const accountId = req.params.accountId;
      const user = await AccountService.getInstance().getAccount(accountId);

      if (!user) {
        throw new Error("User not found");
      }

      res.status(200).json({data: {user: user}});
    } catch (error) {
      const _error = error as Error;
      res.status(400).json({ message: _error.message });
    }
  }
}
