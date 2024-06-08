import { OTPModel } from "@models";
import { EmailService } from "@services";

export class OTPService {
  private static instance: OTPService | null = null;

  private constructor() {}

  static getInstance(): OTPService {
    if (!OTPService.instance) {
      OTPService.instance = new OTPService();
    }

    return OTPService.instance;
  }
  createOTP = async (email: string, otp: string) => {
    try {
      const expirationTime = new Date();
      expirationTime.setMinutes(expirationTime.getMinutes() + 2);
      await OTPModel.create({ email, otp, expirationTime });
    } catch (error) {
      const _error = error as Error;
      throw new Error(`Error storing OTP: ${_error.message}`);
    }
  };

  getOTP = async (email: string) => {
    try {
      const otp = await OTPModel.findOne({ email }).sort({
        expirationTime: -1,
      });
      if (otp && otp.expirationTime < new Date()) {
        return null;
      }
      return otp;
    } catch (error) {
      const _error = error as Error;
      throw new Error(`Error getting OTP: ${_error.message}`);
    }
  };

  deleteOTP = async (email: string) => {
    try {
      await OTPModel.deleteMany({ email });
    } catch (error) {
      const _error = error as Error;
      throw new Error(`Error deleting OTP: ${_error.message}`);
    }
  };

  sendOTP = async (email: string, otp: string) => {
    try {
      await this.deleteOTP(email);
      await this.createOTP(email, otp);
      await EmailService.getInstance().sendOTP(email, otp);
    } catch (error) {
      const _error = error as Error;
      throw new Error(`Error sending OTP: ${_error.message}`);
    }
  };
}
