import { Schema, model } from "mongoose";
const accountSchema = new Schema({
  username: {
    type: String,
    required: true,
    minlength: 6,
  },
  email: {
    type: String, 
    required: true,
    minlength: 6,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  }, 
  role: {
    type: String,
    required: true,
    enum: ["customer", "hotelier"]
  },
  bank_number: String,
  wallet: {
    type: Number,
    default: 0,
  },
  phone: String,
  fullname: String,
  // only hotelier
  hotel_name: String,
  hotel_address: String,
  description: String,
  image: String, // hotel image url
}, { timestamps: true });

export const AccountModel = model("Account", accountSchema);
export default { AccountModel };
