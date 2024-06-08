import { Request, Response } from "express";
import { RatingService } from "@services";

export class RatingController {
  private static instance: RatingController | null = null;

  private constructor() {}

  static getInstance(): RatingController {
    if (!RatingController.instance) {
      RatingController.instance = new RatingController();
    }

    return RatingController.instance;
  }

  addRating = async (req: Request, res: Response) => {
    try {
      const rating = req.body;
      const newRating = await RatingService.getInstance().addRating(rating);
      res.json({ data: newRating });
    } catch (error) {
      const _error = error as Error;
      res.status(500).json({ message: _error.message });
    }
  };

  getRatingOfHotel = async (req: Request, res: Response) => {
    try {
      const { hotel_id } = req.params;
      const ratings = await RatingService.getInstance().getRatingOfHotel(
        hotel_id
      );
      res.json({ data: ratings });
    } catch (error) {
      const _error = error as Error;
      res.status(500).json({ message: _error.message });
    }
  };

  getAverageRating = async (req: Request, res: Response) => {
    try {
      const { hotel_id } = req.params;
      const average = await RatingService.getInstance().getAverageRating(
        hotel_id
      );
      res.json({ data: average });
    } catch (error) {
      const _error = error as Error;
      res.status(500).json({ message: _error.message });
    }
  };
}
