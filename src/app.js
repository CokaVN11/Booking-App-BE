import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
dotenv.config(path.join(__dirname, '.env'))

const app = express();


app.listen(process.env.PORT, () => {
    console.log('====================================');
    console.log(`Server is running on port ${process.env.PORT}`);
    console.log('====================================');
})
