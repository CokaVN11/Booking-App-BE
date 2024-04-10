import { Router } from "express";
import { AccountController } from "@controllers";

export const accountRoute = Router();

accountRoute.post("/login", AccountController.getInstance().login);

accountRoute.post("/register", AccountController.getInstance().register);
