import { RatingModel } from "@models";
import mongoose from "mongoose";

export class RatingService {
    private static instance: RatingService | null = null;

    private constructor() { }

    static getInstance(): RatingService {
        if (!RatingService.instance) {
            RatingService.instance = new RatingService();
        }

        return RatingService.instance;
    }

    getAverageRating = async (hotel_id: string) => {
        const ratings = await RatingModel.find({ hotel: new mongoose.Types.ObjectId(hotel_id) });
        if (!ratings) {
            throw new Error("Rating not found");
        }
        if (ratings.length === 0) {
            return 0;
        }
        
        const total = ratings.reduce((acc, rating) => acc + rating.star, 0);
        return total / ratings.length;
    };
}