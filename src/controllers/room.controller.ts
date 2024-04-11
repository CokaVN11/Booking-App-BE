import { Request, Response } from "express";
import { RoomService } from "@services";

export class RoomController {
    private static instance: RoomController | null = null;

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
          const { hotel, room_type, name, image, amenities_ids } = req.body;
          const room = await RoomService.getInstance().addRoom(
            {
                hotel,
                room_type,
                name,
                is_accepted: false,
                is_booked: false,
                image,
                amenities_ids,
            }
          );
          res.status(200).json(room);
        } catch (error) {
          const _error = error as Error;
          res.status(400).json({ message: _error.message });
        }
      };
}