import { Account, AccountModel } from "@models/account.model";
import { Schema } from "mongoose";

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
    const account = await AccountModel.findById(id);
    if (!account) {
      throw new Error("Account not found");
    }
    return account;
  }

  addAccount = async (user: Account) => {
    const account = new AccountModel(user);
    try {
      await account.save();
      return account;
    } catch (error) {
      const _error = error as Error;
      throw new Error(_error.message);
    }
  }
}