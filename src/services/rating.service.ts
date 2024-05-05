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

    addRating = async (rating_data: Rating) => {
        const rating = new RatingModel(rating_data);
        try {
            await rating.save();
            return rating;
        } catch (error) {
            const _error = error as Error;
            throw new Error(_error.message);
        }
    };

    getRatingOfHotel = async (hotel_id: string) => {
        const ratings = await RatingModel.find({ hotel: new mongoose.Types.ObjectId(hotel_id) });
        if (!ratings) {
            throw new Error("Rating not found");
        }
        return ratings;
    };

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