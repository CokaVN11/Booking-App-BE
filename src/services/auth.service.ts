import { Account } from "@models";
import crypto from "crypto";

class AuthService {
  private static instance: AuthService | null = null;

  private constructor() {}

  static getInstance(): AuthService {
    if (AuthService.instance === null) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
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

  addNewAccount = async (
    username: string, 
    password: string,
    email: string,
    role: string, 
  ) => {
    try {
      if(!username || !password || !email || !role){
        throw new Error("Missing required fields");
      }

      if(await this.getAccountByUsername(username)){
        throw new Error("Account already exists");
      }

      const hashedPassword = await this.hashPassword(password);

      await Account.create({
        username,
        password: hashedPassword,
        email,
        role,
        wallet: 0,
      });
    }
    catch (error) {
      const _error = error as Error;
      throw new Error(`${_error.message}`);
    }
  };
}

export { AuthService };
