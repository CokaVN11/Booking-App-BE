import { AccountModel, RoomModel } from "@models";
import crypto from "crypto";
import mongoose from "mongoose";

type AccountRes = {
  _id?: string;
  username: string;
  email: string;
  role: string;
  bankNumber: string;
  wallet: number;
  phone: string;
  fullname: string;
  hotelName?: string;
  hotelAddress?: string;
  description?: string;
  image?: string;
};

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

  getModerators = async (user_id: string, start: number, num: number) => {
    try {
      let recommend: AccountRes[] = [];
      try {
        recommend = await this.getRecommendation(user_id, num * 2);
      } catch (error) {
        console.log(error);
      }

      const moderators = await AccountModel.find({ role: "moderator" }).skip(start).limit(num - recommend.length);

      const data = moderators.map((moderator) => {
        return {
          _id: moderator._id.toString(),
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
        } as AccountRes
      });

      data.push(...recommend);

      // return unique moderators
      return data.filter((moderator, index, self) => self.findIndex((t) => t._id === moderator._id) === index);
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

  getRecommendation = async (user_id: string, num: number): Promise<AccountRes[]> => {
    try {
      const account = await AccountModel.findById(user_id);
      if (!account) {
        throw new Error("Account not found");
      }

      const recommendationRoom = await fetch(`http://localhost:8080/recommend?userId=${user_id}&number=${num}`)
      const recommendation = await recommendationRoom.json();

      // find the hotel_id of the recommendation room id and return hotel info
      const hotelIds = await Promise.all(recommendation.map(async (roomId: string) => await RoomModel.findById(roomId, { hotel_id: 1 })));
      const uniqueHotelIds = Array.from(new Set(hotelIds.map((hotelId) => hotelId.hotel_id)));
      const hotels = await Promise.all(uniqueHotelIds.map(async (hotelId) => await AccountModel.findById(hotelId)));

      const data = hotels.map((hotel) => {
        return {
          _id: hotel?._id.toString(),
          username: hotel?.username,
          email: hotel?.email,
          role: hotel?.role,
          bankNumber: hotel?.bank_number,
          wallet: hotel?.wallet,
          phone: hotel?.phone,
          fullname: hotel?.fullname,
          hotelName: hotel?.hotel_name,
          hotelAddress: hotel?.hotel_address,
          description: hotel?.description,
          image: hotel?.image,
        } as AccountRes;
      });
    

      return data;
    } catch (error) {
      const _error = error as Error;
      throw new Error(_error.message);
    }
  };

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
