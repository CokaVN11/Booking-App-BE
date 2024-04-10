import { Booking, BookingModel } from "@models/booking.model";

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
    const newBooking = new BookingModel(booking);
    try {
      await newBooking.save();
      return newBooking;
    } catch (error) {
      const _error = error as Error;
      throw new Error(_error.message);
    }
  };


}

