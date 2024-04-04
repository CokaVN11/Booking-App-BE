import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import cors from 'cors';
import logger from 'morgan';

// routes
import authRouter from './routes/auth.route.js';
import moderatorRouter from './routes/moderator.route.js';
import customerRouter from './routes/customer.route.js';
import bookingRouter from './routes/booking.route.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config(path.join(__dirname, ".env"));

const app = express();
const router = express.Router();

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(logger('dev'));

app.use('/api', router);
router.get('/', (req, res) => {
    console.log('Welcome to the JoyServe API');
    res.send('Welcome to the JoyServe API');
});

router.use('/auth', authRouter);
router.use('/moderator', moderatorRouter);
router.use('/customer', customerRouter);
router.use('/booking', bookingRouter);

mongoose
  .connect(process.env.MONGO_URL)
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
    console.log(process.env.MONGO_URL);
    process.exit();
  });
