import { Router } from "express";
import { AccountController } from "@controllers";

export const authRoute = Router();

authRoute.post("/login", AccountController.getInstance().login);

authRoute.post("/register", AccountController.getInstance().register);
