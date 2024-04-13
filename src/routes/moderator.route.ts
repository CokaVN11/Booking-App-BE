import { Router } from "express";
import * as Controller from "@controllers";

export const moderatorRoute = Router();

moderatorRoute.get("/", (_, res) => {
  res.send("Moderator route");
});

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

moderatorRoute.post(
  "/room_type",
  Controller.RoomTypeController.getInstance().addRoomType
);
moderatorRoute.post("/room", Controller.RoomController.getInstance().addRoom);
