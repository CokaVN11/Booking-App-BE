import { Router } from "express";

export const customerRoute = Router();

customerRoute.get("/", (_req, res) => {
  res.send("Customer route");
});

customerRoute.get("/get_all_rooms", (_req, res) => {
  res.send("Get all rooms");
});

customerRoute.get("/get_room/:id", (req, res) => {
  const id = req.params.id;
  res.send(`Get room with id ${id}`);
});