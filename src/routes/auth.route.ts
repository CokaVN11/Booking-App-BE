import { AccountController } from "@controllers";
import { Router } from "express";

export const authRoute = Router();

authRoute.get("/", (_req, res) => {
  res.json({ message: "Welcome to the auth route" });
});

authRoute.post("/register", AccountController.getInstance().register);
authRoute.post("/login", AccountController.getInstance().login);
authRoute.put("/update", AccountController.getInstance().update);
authRoute.delete("/delete", AccountController.getInstance().delete);
authRoute.post("/hash-password", AccountController.getInstance().hashPassword);
authRoute.post(
  "/forgot-password",
  AccountController.getInstance().forgotPassword
);
authRoute.post("/verify-otp", AccountController.getInstance().verifyOTP);
authRoute.post(
  "/reset-password",
  AccountController.getInstance().resetPassword
);
