import { Request, Response } from "express";
import { ReportService } from "@/services";

export class ReportController {
    private static instance: ReportController | null = null;

    private constructor() { }

    static getInstance(): ReportController {
        if (!ReportController.instance) {
            ReportController.instance = new ReportController();
        }

        return ReportController.instance;
    }

    // Code here
}