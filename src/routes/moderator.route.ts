import { Router } from "express";
import { ModeratorController } from "@controllers";

export const moderatorRoute = Router();

moderatorRoute.get("/", (_req, res) => {
  res.send("Moderator route");
});

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
