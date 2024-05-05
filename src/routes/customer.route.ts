import * as Controller from "@controllers";
import { Router } from "express";

export const customerRoute = Router();

// Notification
customerRoute.get("/noti/:to", Controller.NotificationController.getInstance().getNotificationByTo);


customerRoute.get(
  "/hotel",
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

customerRoute.get(
  "/profile/:accountId",
  Controller.AccountController.getInstance().getProfile
)

customerRoute.put(
  "/profile/:accountId",
  Controller.AccountController.getInstance().update
)

customerRoute.get(
  "/rating/:hotel_id",
  Controller.RatingController.getInstance().getRatingOfHotel
);

customerRoute.post(
  "/rating",
  Controller.RatingController.getInstance().addRating
);
customerRoute.post(
  "/booking",
  Controller.BookingController.getInstance().addBooking
)

customerRoute.get("/noti/:to", Controller.NotificationController.getInstance().getNotificationByTo);