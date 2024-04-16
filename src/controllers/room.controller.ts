import { Request, Response } from "express";
import { RoomService } from "@services";

export class RoomController {
    private static instance?: RoomController;

    private constructor() { }

    static getInstance(): RoomController {
        if (!RoomController.instance) {
            RoomController.instance = new RoomController();
        }

        return RoomController.instance;
    }

    // Code here
    addRoom = async (req: Request, res: Response) => {
        try {
          const room = await RoomService.getInstance().addRoom(req.body);
          res.status(200).json({ data: room });
        } catch (error) {
          const _error = error as Error;
          res.status(400).json({ message: _error.message });
        }
      };
}