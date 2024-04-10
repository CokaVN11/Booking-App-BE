import { Router } from "express";
import { AuthController } from "@controllers";

export const authRoute = Router();

authRoute.get("/", (_req, res) => {
  res.json({ message: "Welcome to the auth route" });
});

authRoute.post("/login", (req, res) => {
  AuthController.getInstance().login(req, res);
});

authRoute.post("/hash-password", (req, res) => {
  AuthController.getInstance().hashPassword(req, res);
});
authRoute.post("/register", AuthController.getInstance().register);
