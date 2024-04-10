import 'module-alias/register';
import "dotenv/config";
import 'module-alias/register';
import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from 'cors';
import logger from 'morgan';

// routes
import { accountRoute, bookingRoute, customerRoute, moderatorRoute } from "./routes";

dotenv.config({ path: __dirname + '/.env' });

const app = express();

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(logger('dev'));

const router = express.Router();
app.use(router);

router.get('/', (_req, res) => {
  console.log('Welcome to the JoyServe API');
  res.send('Welcome to the JoyServe API');
});

router.use('/account', accountRoute);
router.use('/moderator', moderatorRoute);
router.use('/customer', customerRoute);
router.use('/booking', bookingRoute);

mongoose
  .connect(process.env.MONGO_URL + "?appName=JoyHub")
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
