import { Request, Response } from "express";
import { ModeratorService } from "@services";

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
      const { name } = req.body;
      const amenity = await ModeratorService.getInstance().addAmenity(name);
      res.status(200).json(amenity);
    } catch (error) {
      const _error = error as Error;
      res.status(400).json({ message: _error.message });
    }
  };

  updateAmenity = async (req: Request, res: Response) => {
    try {
      const id = req.params.id;
      const { name } = req.body;
      const amenity = await ModeratorService.getInstance().updateAmenity(
        id,
        name
      );
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

  addRoomType = async (req: Request, res: Response) => {
    try {
      const {
        name,
        hotel,
        description,
        price,
        guest,
        bedroom,
        bathroom,
        area,
      } = req.body;
      const roomType = await ModeratorService.getInstance().addRoomType({
        name,
        hotel,
        description,
        price,
        guest,
        bedroom,
        bathroom,
        area,
      });
      res.status(200).json(roomType);
    } catch (error) {
      const _error = error as Error;
      res.status(400).json({ message: _error.message });
    }
  };

  addRoom = async (req: Request, res: Response) => {
    try {
      const { hotel, room_type, name, image, amenities_ids } = req.body;
      const room = await ModeratorService.getInstance().addRoom({
        hotel,
        room_type,
        name,
        image,
        amenities_ids,
      });
      res.status(200).json(room);
    } catch (error) {
      const _error = error as Error;
      res.status(400).json({ message: _error.message });
    }
  };
}
