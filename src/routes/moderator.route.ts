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
moderatorRoute.get(
  "/booking/:hotel",
  Controller.BookingController.getInstance().getBookingOfHotel
);
moderatorRoute.put(
  "/booking",
  Controller.BookingController.getInstance().updateBookingStatus
);
moderatorRoute.delete(
  "/booking/:id",
  Controller.BookingController.getInstance().deleteBooking
);
