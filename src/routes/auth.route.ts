import { AccountController } from "@controllers";
import { Router } from "express";

export const authRoute = Router();

authRoute.get("/", (_req, res) => {
  res.json({ message: "Welcome to the auth route" });
});

authRoute.post("/register", AccountController.getInstance().register);

authRoute.post("/login", AccountController.getInstance().login);