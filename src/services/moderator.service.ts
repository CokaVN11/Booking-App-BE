import { Room, RoomModel, RoomType, RoomTypeModel } from "@models/room.model";

export class ModeratorService {
  private static instance: ModeratorService | null = null;

  private constructor() {}

  static getInstance(): ModeratorService {
    if (!ModeratorService.instance) {
      ModeratorService.instance = new ModeratorService();
    }

    return ModeratorService.instance;
  }

  getAllRoom = async () => {
    const rooms = await RoomModel.find();
    if (!rooms) {
      throw new Error("No rooms found");
    }
    return rooms;
  };

  addRoomType = async (room_type_data: RoomType) => {
    const room_type = new RoomTypeModel(room_type_data);
    try {
      await room_type.save();
      return room_type;
    } catch (error) {
      const _error = error as Error;
      throw new Error(_error.message);
    }
  }

  addRoom = async (room_data: Room) => {
    const room = new RoomModel(room_data);
    try {
      await room.save();
      return room;
    } catch (error) {
      const _error = error as Error;
      throw new Error(_error.message);
    }
  }
}