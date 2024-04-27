import { AccountController } from "@controllers";
import { Router } from "express";

export const authRoute = Router();

authRoute.get("/", (_req, res) => {
  res.json({ message: "Welcome to the auth route" });
  console.log(_req.body);
});

authRoute.post("/register", AccountController.getInstance().register);

authRoute.post("/login", AccountController.getInstance().login);

authRoute.put("/update", AccountController.getInstance().update);

authRoute.delete("/delete", AccountController.getInstance().delete);
