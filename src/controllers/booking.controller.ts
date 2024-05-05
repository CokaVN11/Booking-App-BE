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

    getAllWaitingBooking = async (req: Request, res: Response) => {
        try {
            const hotel_id = req.params.hotel_id;
            const bookings = await BookingService.getInstance().getAllWaitingBooking(hotel_id);
            res.status(200).json({ data: bookings });
        } catch (error) {
            const _error = error as Error;
            res.status(400).json({ message: _error.message });
        }
    }

    getAllAcceptedBooking = async (req: Request, res: Response) => {
        try {
            const hotel_id = req.params.hotel_id;
            const bookings = await BookingService.getInstance().getAllAcceptedBooking(hotel_id);
            res.status(200).json({ data: bookings });
        } catch (error) {
            const _error = error as Error;
            res.status(400).json({ message: _error.message });
        }
    }

    getAllStayingBooking = async (req: Request, res: Response) => {
        try {
            const hotel_id = req.params.hotel_id;
            const bookings = await BookingService.getInstance().getAllStayingBooking(hotel_id);
            res.status(200).json({ data: bookings });
        } catch (error) {
            const _error = error as Error;
            res.status(400).json({ message: _error.message });
        }
    }

    acceptBooking = async (req: Request, res: Response) => {
        try {
            const booking_id = req.params.booking_id;
            const updatedBooking = await BookingService.getInstance().acceptBooking(booking_id);
            res.status(200).json({ data: updatedBooking });
        } catch (error) {
            const _error = error as Error;
            res.status(400).json({ message: _error.message });
        }
    }

    rejectBooking = async (req: Request, res: Response) => {
        try {
            const booking_id = req.params.booking_id;
            const updatedBooking = await BookingService.getInstance().rejectBooking(booking_id);
            res.status(200).json({ data: updatedBooking });
        } catch (error) {
            const _error = error as Error;
            res.status(400).json({ message: _error.message });
        }
    }

    checkInBooking = async (req: Request, res: Response) => {
        try {
            const booking_id = req.params.booking_id;
            const updatedBooking = await BookingService.getInstance().checkInBooking(booking_id);
            res.status(200).json({ data: updatedBooking });
        } catch (error) {
            const _error = error as Error;
            res.status(400).json({ message: _error.message });
        }
    }

    checkOutBooking = async (req: Request, res: Response) => {
        try {
            const booking_id = req.params.booking_id;
            const updatedBooking = await BookingService.getInstance().checkOutBooking(booking_id);
            res.status(200).json({ data: updatedBooking });
        } catch (error) {
            const _error = error as Error;
            res.status(400).json({ message: _error.message });
        }
    }
}