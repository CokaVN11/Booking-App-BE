import { Request, Response } from 'express';
import { AccountService } from '@services';

export class AuthController {
  private static instance: AuthController | null = null;

  private constructor() {}

  static getInstance(): AuthController {
    if (!AuthController.instance) {
      AuthController.instance = new AuthController();
    }

    return AuthController.instance;
  }

  register = async (req: Request, res: Response) => {
    try {
      const { username, email, password, role, bank_number, wallet, phone, fullname, hotel_name, hotel_address, description, image } = req.body;
      const user = await AccountService.getInstance().addAccount({ username, email, password, role, bank_number, wallet, phone, fullname, hotel_name, hotel_address, description, image });
      res.status(200).json(user);
    } catch (error) {
      const _error = error as Error;
      res.status(400).json({ message: _error.message });
    }
  };
}