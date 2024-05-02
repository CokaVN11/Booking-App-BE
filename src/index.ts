import "module-alias/register";
import "dotenv/config";
import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import logger from "morgan";
import passport from "passport";
import passportConfig from "./config/passport";
import session from "express-session";
import { AuthMiddleware } from "@middlewares";

// routes
import {
  authRoute,
  bookingRoute,
  customerRoute,
  moderatorRoute,
} from "@routes";

dotenv.config({ path: __dirname + "/.env" });

const app = express();

// Passport configuration
passportConfig(passport);
app.use(
  session({
    secret: process.env.PASSPORT_SECRET || "default-secret",
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(logger("dev"));

const router = express.Router();
app.use(router);

router.get("/", (_req, res) => {
  console.log("Welcome to the JoyServe API");
  res.send("Welcome to the JoyServe API");
});

router.use("/auth", authRoute);

router.use(AuthMiddleware.getInstance().authenticate);
router.use("/booking", bookingRoute);

// router.use(AuthMiddleware.getInstance().authorize);
router.use("/moderator", moderatorRoute);
router.use("/customer", customerRoute);

mongoose
  .connect(process.env.MONGO_URL as string)
  .then(() => {
    console.log("[MONGO] Successfully connect to MongoDB.");
    app.listen(process.env.PORT, () => {
      console.log("====================================");
      console.log(`Server is running on port ${process.env.PORT}`);
      console.log("====================================");
    });
  })
  .catch((err) => {
    console.error("[MONGO] Connection error", err.message);
    process.exit();
  });
