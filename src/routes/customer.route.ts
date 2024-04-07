import { Router } from "express";

export const customerRoute = Router();

customerRoute.get("/", (_req, res) => {
  res.send("Customer route");
});
