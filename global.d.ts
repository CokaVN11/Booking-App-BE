import { Types } from "mongoose";
import { Role, BookingStatus, BillStatus, NotificationStatus } from "./src/types";

type ObjectValues<T> = T[keyof T]

type Account = {
  _id?: Types.ObjectId;
  username: string;
  email: string;
  password: string;
  role: Role;
  bank_number?: string;
  wallet: number;
  phone?: string;
  fullname?: string;
  hotel_name?: string;
  hotel_address?: string;
  description?: string;
  image?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

type Booking = {
  _id?: Types.ObjectId;
  hotel: Types.ObjectId;
  customer: Types.ObjectId;
  room: Types.ObjectId;
  check_in: Date;
  check_out: Date;
  is_canceled: boolean;
  status: BookingStatus;
  createdAt?: Date;
  updatedAt?: Date;
}

type Bill = {
  _id?: Types.ObjectId;
  customer: Types.ObjectId;
  total: number;
  status: BillStatus;
  bookings: Types.ObjectId[];
  createdAt?: Date;
  updatedAt?: Date;
}

type Notification = {
  _id?: Types.ObjectId;
  from_id: Types.ObjectId;
  to_id: Types.ObjectId;
  for: Role;
  title: string;
  content: string;
  status: NotificationStatus;
  booking?: Types.ObjectId;
  room?: Types.ObjectId;
  is_read: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

type Report = {
  _id?: Types.ObjectId;
  booking: Types.ObjectId;
  hotel: Types.ObjectId;
  title: string;
  content: string;
  is_read: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

type Rating = {
  _id?: Types.ObjectId;
  hotel: Types.ObjectId;
  customer: Types.ObjectId;
  room: Types.ObjectId;
  content: string;
  star: number;
  createdAt?: Date;
  updatedAt?: Date;
}

type RoomType = {
  _id?: Types.ObjectId;
  name: string;
  hotel: Types.ObjectId;
  description?: string;
  price: number;
  guest: number;
  bedroom: number;
  bathroom: number;
  area: number;
}

type Room = {
  _id?: Types.ObjectId;
  hotel: Types.ObjectId;
  room_type: RoomType;
  name: string;
  image: string;
  amenities_ids: Types.ObjectId[];
}