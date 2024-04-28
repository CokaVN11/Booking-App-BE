import * as Controller from "@controllers";
import { Router } from "express";

export const customerRoute = Router();

customerRoute.post(
  "/booking",
  Controller.BookingController.getInstance().addBooking
);
customerRoute.get(
  "/booking/:customer",
  Controller.BookingController.getInstance().getBookingOfCustomer
);
customerRoute.put(
  "/booking",
  Controller.BookingController.getInstance().updateBookingDate
);
