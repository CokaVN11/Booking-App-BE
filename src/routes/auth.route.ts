import { Router } from "express";

export const authRoute = Router();

authRoute.get("/", (_req, res) => {
  res.send("Auth route");
});
