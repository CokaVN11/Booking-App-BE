import { Router } from "express";

export const moderatorRoute = Router();

moderatorRoute.get("/", (_req, res) => {
  res.send("Moderator route");
});
