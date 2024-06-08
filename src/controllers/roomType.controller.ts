import { Request, Response } from "express";
import { RoomTypeService } from "@services";

export class RoomTypeController {
  private static instance?: RoomTypeController;

  private constructor() {}

  static getInstance(): RoomTypeController {
    if (!RoomTypeController.instance) {
      RoomTypeController.instance = new RoomTypeController();
    }

    return RoomTypeController.instance;
  }

  // Code here
  getAllRoomType = async (_: Request, res: Response) => {
    try {
      const roomTypes = await RoomTypeService.getInstance().getAllRoomType();
      res.status(200).json({ data: roomTypes });
    } catch (error) {
      const _error = error as Error;
      res.status(400).json({ message: _error.message });
    }
  };

  getRoomTypeByHotelId = async (req: Request, res: Response) => {
    try {
      const roomTypes =
        await RoomTypeService.getInstance().getRoomTypeByHotelId(
          req.params.hotel_id
        );
      res.status(200).json({ data: roomTypes });
    } catch (error) {
      const _error = error as Error;
      res.status(400).json({ message: _error.message });
    }
  };

  addRoomType = async (req: Request, res: Response) => {
    try {
      const roomType = await RoomTypeService.getInstance().addRoomType(
        req.body
      );
      res.status(200).json({ data: roomType });
    } catch (error) {
      const _error = error as Error;
      res.status(400).json({ message: _error.message });
    }
  };

  updateRoomType = async (req: Request, res: Response) => {
    try {
      const roomType = await RoomTypeService.getInstance().updateRoomType(
        req.params.id,
        req.body
      );
      res.status(200).json({ data: roomType });
    } catch (error) {
      const _error = error as Error;
      res.status(400).json({ message: _error.message });
    }
  };

  deleteRoomType = async (req: Request, res: Response) => {
    try {
      const roomType = await RoomTypeService.getInstance().deleteRoomType(
        req.params.id
      );
      res.status(200).json({ data: roomType });
    } catch (error) {
      const _error = error as Error;
      res.status(400).json({ message: _error.message });
    }
  };
}
