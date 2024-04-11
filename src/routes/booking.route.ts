import { Router } from "express";
import * as Controller from "@controllers";

export const bookingRoute = Router();

bookingRoute.get("/", (_req, res) => {
  res.send("Booking route");
});
