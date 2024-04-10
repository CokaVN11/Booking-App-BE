import { getModelForClass, prop } from "@typegoose/typegoose";

export class Account {
  @prop({ required: true, minlength: 6 })
  username!: string;

  @prop({ required: true, minlength: 6 })
  email!: string;

  @prop({ required: true, minlength: 6 })
  password!: string;

  @prop({ required: true, enum: ["customer", "hotelier"] })
  role!: string;

  @prop()
  bank_number?: string;

  @prop({ default: 0 })
  wallet?: number;

  @prop()
  phone?: string;

  @prop()
  fullname?: string;

  @prop()
  hotel_name?: string;

  @prop()
  hotel_address?: string;

  @prop()
  description?: string;

  @prop()
  image?: string;
}

export const AccountModel = getModelForClass(Account);
export default { AccountModel };