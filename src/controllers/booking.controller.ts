import { Request, Response } from "express";
import { BookingService } from "@services";

export class BookingController {
    private static instance: BookingController | null = null;

    private constructor() { }

    static getInstance(): BookingController {
        if (!BookingController.instance) {
            BookingController.instance = new BookingController();
        }

        return BookingController.instance;
    }

    // Code here
    addBooking = async (req: Request, res: Response) => {
        try {
            const booking = req.body;
            const newBooking = await BookingService.getInstance().addBooking(booking);
            res.status(200).json(newBooking);
        } catch (error) {
            const _error = error as Error;
            res.status(400).json({ message: _error.message });
        }
    };

    getBookingOfCustomer = async (req: Request, res: Response) => {
        try {
            const customer = req.params.customer;
            const bookings = await BookingService.getInstance().getBookingOfCustomer(customer);
            res.status(200).json(bookings);
        } catch (error) {
            const _error = error as Error;
            res.status(400).json({ message: _error.message });
        }
    };

    getBookingOfHotel = async (req: Request, res: Response) => {
        try {
            const hotel = req.params.hotel;
            const bookings = await BookingService.getInstance().getBookingOfHotel(hotel);
            res.status(200).json(bookings);
        } catch (error) {
            const _error = error as Error;
            res.status(400).json({ message: _error.message });
        }
    };

    updateBookingDate = async (req: Request, res: Response) => {
        try {
            const booking = req.body;
            const updatedBooking = await BookingService.getInstance().updateBookingDate(booking);
            res.status(200).json(updatedBooking);
        } catch (error) {
            const _error = error as Error;
            res.status(400).json({ message: _error.message });
        }
    }

    updateBookingStatus = async (req: Request, res: Response) => {
        try {
            const booking = req.body;
            const updatedBooking = await BookingService.getInstance().updateBookingStatus(booking);
            res.status(200).json(updatedBooking);
        } catch (error) {
            const _error = error as Error;
            res.status(400).json({ message: _error.message });
        }
    }

    deleteBooking = async (req: Request, res: Response) => {
        try {
            const id = req.params.id;
            const deletedBooking = await BookingService.getInstance().deleteBooking(id);
            res.status(200).json(deletedBooking);
        } catch (error) {
            const _error = error as Error;
            res.status(400).json({ message: _error.message });
        }
    }
    
}