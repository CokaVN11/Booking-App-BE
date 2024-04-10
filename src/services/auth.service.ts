import { Account } from "@models/account.model";
import { Schema } from "mongoose";

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
    const account = new Account(user);
    try {
      await account.save();
      return account;
    } catch (error) {
      const _error = error as Error;
      throw new Error(_error.message);
    }
  }
}
