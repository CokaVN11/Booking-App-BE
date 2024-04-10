import { Request, Response } from "express";
import { RatingService } from "@/services";

export class RatingController {
    private static instance: RatingController | null = null;

    private constructor() { }

    static getInstance(): RatingController {
        if (!RatingController.instance) {
            RatingController.instance = new RatingController();
        }

        return RatingController.instance;
    }

    // Code here
}