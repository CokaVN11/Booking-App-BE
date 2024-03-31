import express from "express";
import authController from "../controllers/auth.controller.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.send("Auth route");
});

router.post("/login", (req, res) => {
  authController.login(req, res);
});

router.post("/hash-password", (req, res) => {
  authController.hashPassword(req, res);
});

export default router;
