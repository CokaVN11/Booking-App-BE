import { Request, Response } from "express";
import { RatingService } from "@services";

export class RatingController {
    private static instance: RatingController | null = null;

    private constructor() { }

    static getInstance(): RatingController {
        if (!RatingController.instance) {
            RatingController.instance = new RatingController();
        }

        return RatingController.instance;
    }

    getAverageRating = async (req: Request, res: Response) => {
        try {
            const { hotel_id } = req.params;
            const average = await RatingService.getInstance().getAverageRating(hotel_id);
            res.json({ data: average });
        } catch (error) {
            const _error = error as Error;
            res.status(500).json({ message: _error.message });
        }
    };
}