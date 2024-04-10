import { BillModel } from "@/models";

export class BillService {
    private static instance: BillService | null = null;

    private constructor() { }

    static getInstance(): BillService {
        if (!BillService.instance) {
            BillService.instance = new BillService();
        }

        return BillService.instance;
    }

    // Code here    
}