import { AccountModel } from "@models";
import crypto from "crypto";
import mongoose from "mongoose";

export class AccountService {
  private static instance: AccountService | null = null;

  private constructor() {}

  static getInstance(): AccountService {
    if (!AccountService.instance) {
      AccountService.instance = new AccountService();
    }

    return AccountService.instance;
  }

  getAccount = async (id: string) => {
    const account = await AccountModel.findById(id);
    if (!account) {
      throw new Error("Account not found");
    }
    return account;
  };

  addAccount = async (user: Account) => {
    if (await this.getAccountByUsername(user.username)) {
      throw new Error("Account already exists");
    }

    user.password = await this.hashPassword(user.password);

    let account;

    if (user.role === "customer") {
      account = new AccountModel({
        username: user.username,
        email: user.email,
        password: user.password,
        role: user.role,
        bank_number: user.bank_number,
        wallet: user.wallet,
        phone: user.phone,
        fullname: user.fullname,
        image: user.image,
      });
    } else {
      account = new AccountModel({
        username: user.username,
        email: user.email,
        password: user.password,
        role: user.role,
        bank_number: user.bank_number,
        wallet: user.wallet,
        phone: user.phone,
        fullname: user.fullname,
        hotel_name: user.hotel_name,
        hotel_address: user.hotel_address,
        description: user.description,
        image: user.image,
      });
    }

    try {
      await account.save();
      return account;
    } catch (error) {
      const _error = error as Error;
      throw new Error(_error.message);
    }
  };

  getAccountByUsername = async (username: string) => {
    try {
      const account = await AccountModel.findOne({ username });
      return account;
    } catch (error) {
      const _error = error as Error;
      throw new Error(`${_error.message}`);
    }
  };

  hashPassword = async (password: string) => {
    const salt = crypto.randomBytes(16).toString("hex");
    const buf = crypto.scryptSync(password, salt, 64);
    return `${buf.toString("hex")}.${salt}`;
  };

  comparePasswordWithHash = async (password: string, storedPassword: string) => {
    const [hashedPassword, salt] = storedPassword.split(".");
    const buf = Buffer.from(hashedPassword, "hex");
    const hashedPasswordBuf = crypto.scryptSync(password, salt, 64);
    return crypto.timingSafeEqual(buf, hashedPasswordBuf);
  };

  updateAccount = async (accountId: string, user: Account) => {
    try {
      const account = await AccountModel.findOneAndUpdate({ _id: accountId }, user, { new: true })
      if (!account) {
        throw new Error("Account not found");
      }
  
      return account;
    } catch (error) {
      const _error = error as Error;
      throw new Error(_error.message);
    }
  };

  // check whether the hotel_id exist
  checkHotelId = async (hotel_id: string) => {
    const account = await AccountModel.findById(hotel_id);
    if (!account) {
      return false;
    }
    return true;
  };

  deleteAccount = async (account_id: string) => {
    const account = await AccountModel.findById(account_id);
    if (!account) {
      throw new Error("Account not found");
    }
    try {
      await AccountModel.findByIdAndDelete(account_id);
      return account;
    } catch (error) {
      const _error = error as Error;
      throw new Error(_error.message);
    }
  };

  getModerators = async (start: number, num: number) => {
    try {
      const moderators = await AccountModel.find({ role: "moderator" }).skip(start).limit(num);

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

      return data;
    } catch (error) {
      const _error = error as Error;
      throw new Error(_error.message);
    }
  };

  getModerator = async (hotel_id: string) => {
    if (!mongoose.Types.ObjectId.isValid(hotel_id)) {
      throw new Error("Invalid hotel_id");
    }

    const moderator = await AccountModel.findById(hotel_id);
    if (!moderator) {
      throw new Error("Moderator not found");
    }

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
  }
  updatePassword = async (username: string, password: string) => {
    try {
      const account = await AccountModel.findOneAndUpdate(
        { username },
        { password: await this.hashPassword(password) }
      );

      if (!account) {
        throw new Error("Account not found");
      }

      return account;
    } catch (error) {
      const _error = error as Error;
      throw new Error(_error.message);
    }
  };
}
