import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url'
import mongoose from 'mongoose';

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
dotenv.config(path.join(__dirname, '.env'))

const app = express();


mongoose.connect(process.env.MONGO_URL).then(() => {
    console.log("[MONGO] Successfully connect to MongoDB.");
    app.listen(process.env.PORT, () => {
        console.log('====================================');
        console.log(`Server is running on port ${process.env.PORT}`);
        console.log('====================================');
    })
}).catch(err => {
    console.error("[MONGO] Connection error", err.message);
    process.exit();
});


