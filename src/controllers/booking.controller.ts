import { Request, Response } from "express";
import { BookingService } from "@/services";

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
}