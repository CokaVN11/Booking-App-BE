import { Request, Response } from "express";
import { AmenityService } from "@services";

export class AmenityController {
    private static instance?: AmenityController;

    private constructor() { }

    static getInstance(): AmenityController {
        if (!AmenityController.instance) {
            AmenityController.instance = new AmenityController();
        }

        return AmenityController.instance;
    }

    // Code here
    getAllAmenity = async (_req: Request, res: Response) => {
        try {
            const amenities = await AmenityService.getInstance().getAllAmenity();
            res.status(200).json({ data: amenities });
        } catch (error) {
            const _error = error as Error;
            res.status(400).json({ message: _error.message });
        }
    };

    getAmenity = async (req: Request, res: Response) => {
        try {
            const id = req.params.id;
            const amenity = await AmenityService.getInstance().getAmenity(id);
            res.status(200).json({ data: amenity });
        } catch (error) {
            const _error = error as Error;
            res.status(400).json({ message: _error.message });
        }
    };

    addAmenity = async (req: Request, res: Response) => {
        try {
            const { name } = req.body;
            const amenity = await AmenityService.getInstance().addAmenity(name);
            res.status(200).json({ data: amenity });
        } catch (error) {
            const _error = error as Error;
            res.status(400).json({ message: _error.message });
        }
    };

    updateAmenity = async (req: Request, res: Response) => {
        try {
            const id = req.params.id;
            const { name } = req.body;
            const amenity = await AmenityService.getInstance().updateAmenity(
                id,
                name
            );
            res.status(200).json({ data: amenity });
        } catch (error) {
            const _error = error as Error;
            res.status(400).json({ message: _error.message });
        }
    };

    deleteAmenity = async (req: Request, res: Response) => {
        try {
            const id = req.params.id;
            await AmenityService.getInstance().deleteAmenity(id);
            res.status(200).json({ message: "Amenity deleted" });
        } catch (error) {
            const _error = error as Error;
            res.status(400).json({ message: _error.message });
        }
    };
}