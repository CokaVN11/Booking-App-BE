import { Account } from "@models/account.model";
import { Schema } from "mongoose";
import crypto from "crypto";

type Account = {
  username: string;
  email: string;
  password: string;
  role: string;
  bank_number: string;
  wallet: number;
  phone: string;
  fullname: string;
  hotel_name: string | null;
  hotel_address: string | null;
  description: string | null;
  image: string | null;
}

export class AccountService {
  private static instance: AccountService | null = null;

  private constructor() {}

  static getInstance(): AccountService {
    if (!AccountService.instance) {
      AccountService.instance = new AccountService();
    }

    return AccountService.instance;
  }

  getAccount = async (id: Schema.Types.ObjectId) => {
    const account = await Account.findById(id);
    if (!account) {
      throw new Error("Account not found");
    }
    return account;
  }

  addAccount = async (user: Account) => {
    if (await this.getAccountByUsername(user.username)) {
      throw new Error("Account already exists");
    }

    user.password = await this.hashPassword(user.password);
    const account = new Account(user);
    try {
      await account.save();
      return account;
    } catch (error) {
      const _error = error as Error;
      throw new Error(_error.message);
    }
  }

  getAccountByUsername = async (username: string) => {
    try {
      const account = await Account.findOne({ username });
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

  comparePassword = async (password: string, storedPassword: string) => {
    const [hashedPassword, salt] = storedPassword.split(".");
    const buf = Buffer.from(hashedPassword, "hex");
    const hashedPasswordBuf = crypto.scryptSync(password, salt, 64);
    return crypto.timingSafeEqual(buf, hashedPasswordBuf);
  };
}