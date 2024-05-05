import { Request, Response } from "express";
import { RoomService } from "@services";

export class RoomController {
  private static instance?: RoomController;

  private constructor() {}

  static getInstance(): RoomController {
    if (!RoomController.instance) {
      RoomController.instance = new RoomController();
    }

    return RoomController.instance;
  }

  // Code here
  getAllRoom = async (_: Request, res: Response) => {
    try {
      const rooms = await RoomService.getInstance().getAllRoom();
      res.status(200).json({ data: rooms });
    } catch (error) {
      const _error = error as Error;
      res.status(400).json({ message: _error.message + "getAllRoom" });
    }
  };

  getRoomByHotelId = async (req: Request, res: Response) => {
    try {
      const { room_type, is_accepted, is_booked } = req.query;
      const is_accepted_bool =
        is_accepted != undefined ? is_accepted === "true" : undefined;
      const is_booked_bool =
        is_booked != undefined ? is_booked === "true" : undefined;
      const rooms = await RoomService.getInstance().getRoomByHotelId(
        req.params.hotel_id,
        room_type as string,
        is_accepted_bool,
        is_booked_bool
      );
      res.status(200).json({ data: rooms });
    } catch (error) {
      const _error = error as Error;
      res.status(400).json({ message: _error.message });
    }
  };

  getRoomByType = async (req: Request, res: Response) => {
    try {
      const rooms = await RoomService.getInstance().getRoomByType(
        req.params.room_type
      );
      res.status(200).json({ data: rooms });
    } catch (error) {
      const _error = error as Error;
      res.status(400).json({ message: _error.message });
    }
  };

  getAcceptedRoom = async (_: Request, res: Response) => {
    try {
      const rooms = await RoomService.getInstance().getAccepetedRoom();
      res.status(200).json({ data: rooms });
    } catch (error) {
      const _error = error as Error;
      res.status(400).json({ message: _error.message });
    }
  };

  getBookedRoom = async (_: Request, res: Response) => {
    try {
      const rooms = await RoomService.getInstance().getBookedRoom();
      res.status(200).json({ data: rooms });
    } catch (error) {
      const _error = error as Error;
      res.status(400).json({ message: _error.message });
    }
  };

  addRoom = async (req: Request, res: Response) => {
    console.log(req.body + "addRoom");
    try {
      // Extract required data from the request body
      const { hotelName, roomType, roomName, isAccepted, isBooked, img } =
        req.body;

      console.log(hotelName, roomType, roomName, isAccepted, isBooked, img);

      // Call your RoomService to add the room
      const room = await RoomService.getInstance().addRoom({
        hotel: hotelName,
        room_type: roomType,
        name: roomName,
        is_accepted: isAccepted,
        is_booked: isBooked,
        image: img,
        amenities_ids: [], // Assuming amenities are empty for now
      });
      
      res.status(200).json({ data: room });
    } catch (error) {
      // Handle errors
      const _error = error as Error;
      res.status(400).json({ message: _error.message, data: req.body });
    }
  };

  updateRoom = async (req: Request, res: Response) => {
    try {
      const room = await RoomService.getInstance().updateRoom(
        req.params.id,
        req.body
      );
      res.status(200).json({ data: room });
    } catch (error) {
      const _error = error as Error;
      res.status(400).json({ message: _error.message });
    }
  };

  deleteRoom = async (req: Request, res: Response) => {
    try {
      const room = await RoomService.getInstance().deleteRoom(req.params.id);
      res.status(200).json({ data: room });
    } catch (error) {
      const _error = error as Error;
      res.status(400).json({ message: _error.message });
    }
  };

  // get price range of room
  getPriceRange = async (req: Request, res: Response) => {
    try {
      const { hotel_id } = req.params;
      const priceRange = await RoomService.getInstance().getPriceRange(
        hotel_id
      );
      res.json({ data: priceRange });
    } catch (error) {
      const _error = error as Error;
      res.status(500).json({ message: _error.message });
    }
  };
}
