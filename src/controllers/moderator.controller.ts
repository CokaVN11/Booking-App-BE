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
      res.status(200).json({ data: amenities });
    } catch (error) {
      const _error = error as Error;
      res.status(400).json({ message: _error.message });
    }
  };

  getAmenity = async (req: Request, res: Response) => {
    try {
      const id = req.params.id;
      const amenity = await ModeratorService.getInstance().getAmenity(id);
      res.status(200).json({ data: amenity });
    } catch (error) {
      const _error = error as Error;
      res.status(400).json({ message: _error.message });
    }
  };

  addAmenity = async (req: Request, res: Response) => {
    try {
      const { name } = req.body;
      const amenity = await ModeratorService.getInstance().addAmenity(name);
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
      const amenity = await ModeratorService.getInstance().updateAmenity(
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
      await ModeratorService.getInstance().deleteAmenity(id);
      res.status(200).json({ message: "Amenity deleted" });
    } catch (error) {
      const _error = error as Error;
      res.status(400).json({ message: _error.message });
    }
  };

  addRoomType = async (req: Request, res: Response) => {
    try {
      const roomType = await ModeratorService.getInstance().addRoomType(req.body);
      res.status(200).json({ data: roomType });
    } catch (error) {
      const _error = error as Error;
      res.status(400).json({ message: _error.message });
    }
  };

  addRoom = async (req: Request, res: Response) => {
    try {
      const room = await ModeratorService.getInstance().addRoom(req.body);
      res.status(200).json({ data: room });
    } catch (error) {
      const _error = error as Error;
      res.status(400).json({ message: _error.message });
    }
  };
}
