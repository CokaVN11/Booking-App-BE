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

  comparePassword = async (password: string, storedPassword: string) => {
    return password === storedPassword;
  }

  updateAccount = async (user: Account) => {
    const account = await AccountModel.findOne({ username: user.username });
    if (!account) {
      throw new Error("Account not found");
    }

    if (user.password) {
      user.password = await this.hashPassword(user.password);
    }

    try {
      await AccountModel.updateOne({ username: user.username }, user);
      return await AccountModel.findOne({ username: user.username });
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

  getModerators = async () => {
    try {
      const moderators = await AccountModel.find({ role: "moderator" });
      return moderators;
    } catch (error) {
      const _error = error as Error;
      throw new Error(_error.message);
    }
  };
}
