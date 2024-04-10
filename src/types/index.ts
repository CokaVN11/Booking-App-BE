import { ObjectValues } from "global";

export const Amenity = {
  AirConditioner: "Air Conditioner",
  Wifi: "Wifi",
  Television: "Television",
  Shamppoo: "Shamppoo",
  Towel: "Towel",
  Slippers: "Slippers",
  Player: "CD/DVD Player",
  Safe: "Electronic Safe",
  MiniFridge: "Mini Fridge",
  CoffeeMaker: "Coffee Maker",
  Pool: "Swimming Pool",
  River: "River View",
} as const;

export const NotificationStatus = {
  accepted: "accepted",
  canceled: "canceled",
  waiting: "waiting",
  warning: "warning",
  approved: "approved",
  rejected: "rejected",
} as const;

export const BillStatus = {
  waiting: "waiting",
  paid: "paid",
  canceled: "canceled",
} as const;

export const BookingStatus = {
  waiting: "waiting",
  approved: "approved",
  rejected: "rejected",
  canceled: "canceled",
  completed: "completed",
  staying: "staying",
} as const;

export const Role = {
  admin: "admin",
  hotel: "hotel",
  customer: "customer",
} as const;

export type Amenity = ObjectValues<typeof Amenity>;
export type NotificationStatus = ObjectValues<typeof NotificationStatus>;
export type BillStatus = ObjectValues<typeof BillStatus>;
export type BookingStatus = ObjectValues<typeof BookingStatus>;
export type Role = ObjectValues<typeof Role>;
