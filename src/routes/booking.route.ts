import { Router } from 'express';

export const bookingRoute = Router();

bookingRoute.get('/', (_req, res) => {
  res.send('Booking route');
});
