import "dotenv/config";
import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from 'cors';
import logger from 'morgan';

// routes
import { authRoute, bookingRoute, customerRoute, moderatorRoute } from "./routes";

dotenv.config({ path: __dirname + '/.env' });

const app = express();
const router = express.Router();

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(logger('dev'));

app.use('/api', router);
router.get('/', (_req, res) => {
  console.log('Welcome to the JoyServe API');
  res.send('Welcome to the JoyServe API');
});

app.use('/auth', authRoute);
app.use('/moderator', moderatorRoute);
app.use('/customer', customerRoute);
app.use('/booking', bookingRoute);

mongoose
  .connect(process.env.MONGO_URL ?? "")
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
