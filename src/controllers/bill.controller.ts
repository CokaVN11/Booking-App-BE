import { Request, Response } from "express";
import { BillService } from "@/services";

export class BillController {
    private static instance: BillController | null = null;

    private constructor() { }

    static getInstance(): BillController {
        if (!BillController.instance) {
            BillController.instance = new BillController();
        }

        return BillController.instance;
    }

    // Code here
}