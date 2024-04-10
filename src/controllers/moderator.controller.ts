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
      const { hotel, room_type, name, image, amenities } = req.body;
      const room = await ModeratorService.getInstance().addRoom({
        hotel,
        room_type,
        name,
        image,
        amenities,
      });
      res.status(200).json(room);
    } catch (error) {
      const _error = error as Error;
      res.status(400).json({ message: _error.message });
    }
  };
}
