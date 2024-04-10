import { Router } from "express";
import { ModeratorController } from "@controllers";

export const moderatorRoute = Router();

moderatorRoute.get("/", (_req, res) => {
  res.send("Moderator route");
});

moderatorRoute.post("/room_type", ModeratorController.getInstance().addRoomType);
moderatorRoute.post("/room", ModeratorController.getInstance().addRoom);