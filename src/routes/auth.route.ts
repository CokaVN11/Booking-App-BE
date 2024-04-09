import { AuthController } from "@controllers";
import { Router } from "express";

export const authRoute = Router();

authRoute.get("/", (_req, res) => {
  res.json({ message: "Welcome to the auth route" });
});

authRoute.post("/register", AuthController.getInstance().register);