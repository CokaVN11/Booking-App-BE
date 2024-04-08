import { Request, Response } from 'express';
import { ModeratorService } from '@services';

export class ModeratorController {
  private static instance: ModeratorController | null = null;

  private constructor() {}

  static getInstance(): ModeratorController {
    if (!ModeratorController.instance) {
      ModeratorController.instance = new ModeratorController();
    }

    return ModeratorController.instance;
  }

  getAllAmenity = async (_req: Request, res: Response) => {
    try {
      const amenities = await ModeratorService.getInstance().getAllAmenity();
      res.status(200).json(amenities);
    } catch (error) {
      const _error = error as Error;
      res.status(400).json({ message: _error.message });
    }
  };

  getAmenity = async (req: Request, res: Response) => {
    try {
      const id = req.params.id;
      const amenity = await ModeratorService.getInstance().getAmenity(id);
      res.status(200).json(amenity);
    } catch (error) {
      const _error = error as Error;
      res.status(400).json({ message: _error.message });
    }
  };

  addAmenity = async (req: Request, res: Response) => {
    try {
      const { name, amenity_id } = req.body;
      const amenity = await ModeratorService.getInstance().addAmenity(name, amenity_id);
      res.status(200).json(amenity);
    } catch (error) {
      const _error = error as Error;
      res.status(400).json({ message: _error.message });
    }
  };

  updateAmenity = async (req: Request, res: Response) => {
    try {
      const id = req.params.id;
      const { name, amenity_id } = req.body;
      const amenity = await ModeratorService.getInstance().updateAmenity(id, name, amenity_id);
      res.status(200).json(amenity);
    } catch (error) {
      const _error = error as Error;
      res.status(400).json({ message: _error.message });
    }
  };

  deleteAmenity = async (req: Request, res: Response) => {
    try {
      const id = req.params.id;
      const amenity = await ModeratorService.getInstance().deleteAmenity(id);
      res.status(200).json(amenity);
    } catch (error) {
      const _error = error as Error;
      res.status(400).json({ message: _error.message });
    }
  };
}