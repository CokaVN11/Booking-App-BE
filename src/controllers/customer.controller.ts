import { Request, Response } from "express";
import { CustomerService } from "@services";

export class CustomerController {
  private static instance: CustomerController | null = null;

  private constructor() {}

  static getInstance(): CustomerController {
    if (!CustomerController.instance) {
      CustomerController.instance = new CustomerController();
    }

    return CustomerController.instance;
  }

  addBooking = async (req: Request, res: Response) => {
    try {
      const booking = req.body;
      const newBooking = await CustomerService.getInstance().addBooking(booking);
      res.status(200).json(newBooking);
    } catch (error) {
      const _error = error as Error;
      res.status(400).json({ message: _error.message });
    }
  };

  
}