import { Booking, Bill } from "@models/booking.model";

type Booking = {
  hotel: string;
  customer: string;
  room: string;
  check_in: Date;
  check_out: Date;
};

type Bill = {
  customer: string;
  total: number;
  status: string;
  bookings: string[];
};

export class CustomerService {
  private static instance: CustomerService | null = null;

  private constructor() {}

  static getInstance(): CustomerService {
    if (!CustomerService.instance) {
      CustomerService.instance = new CustomerService();
    }

    return CustomerService.instance;
  }

  addBooking = async (booking: Booking) => {
    const newBooking = new Booking(booking);
    try {
      await newBooking.save();
      return newBooking;
    } catch (error) {
      const _error = error as Error;
      throw new Error(_error.message);
    }
  };


}

