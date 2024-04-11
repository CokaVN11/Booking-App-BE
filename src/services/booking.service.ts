import { BookingModel } from "@models";

export class BookingService {
    private static instance: BookingService | null = null;

    private constructor() { }

    static getInstance(): BookingService {
        if (!BookingService.instance) {
            BookingService.instance = new BookingService();
        }

        return BookingService.instance;
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