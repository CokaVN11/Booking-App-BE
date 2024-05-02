import * as Controller from "@controllers";
import { Router } from "express";

export const customerRoute = Router();

customerRoute.get(
  "/hotel/all",
  Controller.AccountController.getInstance().getModerators
);

customerRoute.get(
  "/hotel/:hotel_id",
  Controller.AccountController.getInstance().getModerator
);

customerRoute.get(
  "/hotel/rating/:hotel_id",
  Controller.RatingController.getInstance().getAverageRating
);

customerRoute.get(
  "/hotel/price/:hotel_id",
  Controller.RoomController.getInstance().getPriceRange
);

customerRoute.get(
  "/hotel/amenity/:hotel_id",
  Controller.RoomController.getInstance().getAmenitiesByHotelId
);

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

customerRoute.get(
  "/room/:hotel_id",
  Controller.RoomController.getInstance().getRoomByHotelId
);
