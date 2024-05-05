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
moderatorRoute.get("/room_type",Controller.RoomTypeController.getInstance().getAllRoomType);
moderatorRoute.get("/room_type/:hotel_id", Controller.RoomTypeController.getInstance().getRoomTypeByHotelId);
moderatorRoute.post("/room_type", Controller.RoomTypeController.getInstance().addRoomType);
moderatorRoute.put("/room_type/:id", Controller.RoomTypeController.getInstance().updateRoomType);
moderatorRoute.delete("/room_type/:id", Controller.RoomTypeController.getInstance().deleteRoomType);

// Room
moderatorRoute.post("/room", Controller.RoomController.getInstance().addRoom);

// Booking
moderatorRoute.get("/booking/:hotel", Controller.BookingController.getInstance().getBookingOfHotel);
moderatorRoute.put("/booking", Controller.BookingController.getInstance().updateBookingStatus);
moderatorRoute.delete("/booking/:id", Controller.BookingController.getInstance().deleteBooking);

// Notification
moderatorRoute.get("/noti/:to", Controller.NotificationController.getInstance().getNotificationByTo);