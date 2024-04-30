import { RatingModel } from "@models";

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
        const ratings = await RatingModel.find({ hotel_id });
        if (!ratings) {
            throw new Error("Rating not found");
        }
        if (ratings.length === 0) {
            return 0;
        }
        
        let total = 0;

        ratings.forEach((rating) => {
            total += rating.star;
        });
        return total / ratings.length;
    };
}