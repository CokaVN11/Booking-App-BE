import { Request, Response } from "express";
import { RoomTypeService } from "@services";

export class RoomTypeController {
    private static instance: RoomTypeController | null = null;

    private constructor() { }

    static getInstance(): RoomTypeController {
        if (!RoomTypeController.instance) {
            RoomTypeController.instance = new RoomTypeController();
        }

        return RoomTypeController.instance;
    }

    // Code here
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
          const roomType = await RoomTypeService.getInstance().addRoomType({
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
}