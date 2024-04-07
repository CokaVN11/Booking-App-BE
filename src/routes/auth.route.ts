import { Router } from "express";
import { authController } from "../controllers/auth.controller";

export const authRoute = Router();

authRoute.get("/", (_req, res) => {
  res.send("Auth route");
});

authRoute.post("/login", (req, res) => {
  authController.login(req, res);
});

authRoute.post("/hash-password", (req, res) => {
  authController.hashPassword(req, res);
});
