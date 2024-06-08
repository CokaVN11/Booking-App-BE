import { Schema, model } from "mongoose";

const otpSchema = new Schema({
  otp: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
  },
  expirationTime: {
    type: Date,
    required: true,
  },
});

export const OTPModel = model("otps", otpSchema);
export default { OTPModel };
