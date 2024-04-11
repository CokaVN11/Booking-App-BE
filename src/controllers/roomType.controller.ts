import { Request, Response } from "express";
import { RoomTypeService } from "@services";

export class RoomTypeController {
    private static instance?: RoomTypeController;

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
          const roomType = await RoomTypeService.getInstance().addRoomType(req.body);
          res.status(200).json({ data: roomType });
        } catch (error) {
          const _error = error as Error;
          res.status(400).json({ message: _error.message });
        }
      };
}