import { Router } from "express";
import { ModeratorController } from "@controllers";

export const moderatorRoute = Router();

moderatorRoute.get("/amenity", ModeratorController.getInstance().getAllAmenity);
moderatorRoute.get(
  "/amenity/:id",
  ModeratorController.getInstance().getAmenity
);
moderatorRoute.post("/amenity", ModeratorController.getInstance().addAmenity);
moderatorRoute.put(
  "/amenity/:id",
  ModeratorController.getInstance().updateAmenity
);
moderatorRoute.delete(
  "/amenity/:id",
  ModeratorController.getInstance().deleteAmenity
);

moderatorRoute.post(
  "/room_type",
  ModeratorController.getInstance().addRoomType
);
moderatorRoute.post("/room", ModeratorController.getInstance().addRoom);
