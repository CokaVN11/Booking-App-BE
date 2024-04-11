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

    // Code here    
}