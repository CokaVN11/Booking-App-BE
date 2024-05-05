import { Router } from "express";
import * as Controller from "@controllers";

export const moderatorRoute = Router();

moderatorRoute.get("/", (_, res) => {
  res.send("Moderator route");
});

// Amenities
moderatorRoute.get(
  "/amenity",
  Controller.AmenityController.getInstance().getAllAmenity
);
moderatorRoute.get(
  "/amenity/:id",
  Controller.AmenityController.getInstance().getAmenity
);
moderatorRoute.post(
  "/amenity",
  Controller.AmenityController.getInstance().addAmenity
);
moderatorRoute.put(
  "/amenity/:id",
  Controller.AmenityController.getInstance().updateAmenity
);
moderatorRoute.delete(
  "/amenity/:id",
  Controller.AmenityController.getInstance().deleteAmenity
);

// Room Type
moderatorRoute.get(
  "/room-type",
  Controller.RoomTypeController.getInstance().getAllRoomType
);
moderatorRoute.get(
  "/room-type/:hotel_id",
  Controller.RoomTypeController.getInstance().getRoomTypeByHotelId
);
moderatorRoute.post(
  "/room-type",
  Controller.RoomTypeController.getInstance().addRoomType
);
moderatorRoute.put(
  "/room-type/:id",
  Controller.RoomTypeController.getInstance().updateRoomType
);
moderatorRoute.delete(
  "/room-type/:id",
  Controller.RoomTypeController.getInstance().deleteRoomType
);

// Room
moderatorRoute.get("/room", Controller.RoomController.getInstance().getAllRoom);
moderatorRoute.get(
  "/room/:hotel_id",
  Controller.RoomController.getInstance().getRoomByHotelId
);
moderatorRoute.post("/room", Controller.RoomController.getInstance().addRoom);
moderatorRoute.put(
  "/room/:id",
  Controller.RoomController.getInstance().updateRoom
);
moderatorRoute.delete(
  "/room/:id",
  Controller.RoomController.getInstance().deleteRoom
);

// Booking
moderatorRoute.get("/booking/:hotel", Controller.BookingController.getInstance().getBookingOfHotel);
moderatorRoute.put("/booking", Controller.BookingController.getInstance().updateBookingStatus);
moderatorRoute.delete("/booking/:id", Controller.BookingController.getInstance().deleteBooking);

// Notification
moderatorRoute.get("/noti/:to", Controller.NotificationController.getInstance().getNotificationByTo);
// get all waiting booking
moderatorRoute.get("/booking/waiting/:hotel_id", Controller.BookingController.getInstance().getAllWaitingBooking);
// get all accpeted booking
moderatorRoute.get("/booking/accepted/:hotel_id", Controller.BookingController.getInstance().getAllAcceptedBooking);
// get all staying booking
moderatorRoute.get("/booking/staying/:hotel_id", Controller.BookingController.getInstance().getAllStayingBooking);

// accept booking
moderatorRoute.put("/booking/accept/:booking_id", Controller.BookingController.getInstance().acceptBooking);
// reject booking
moderatorRoute.put("/booking/reject/:booking_id", Controller.BookingController.getInstance().rejectBooking);
// check in booking
moderatorRoute.put("/booking/checkin/:booking_id", Controller.BookingController.getInstance().checkInBooking);
// complete booking
moderatorRoute.put("/booking/checkout/:booking_id", Controller.BookingController.getInstance().checkOutBooking);