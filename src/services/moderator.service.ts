import { Amenity, Room, RoomType } from "@models/room.model";

export class ModeratorService {
  private static instance: ModeratorService | null = null;

  private constructor() {}

  static getInstance(): ModeratorService {
    if (!ModeratorService.instance) {
      ModeratorService.instance = new ModeratorService();
    }

    return ModeratorService.instance;
  }

  getAllAmenity = async () => {
    const amenities = await Amenity.find();
    if (!amenities) {
      throw new Error("No amenities found");
    }
    return amenities;
  };

  getAmenity = async (id: string) => {
    const amenity = await Amenity.findById(id);
    if (!amenity) {
      throw new Error("Amenity not found");
    }
    return amenity;
  };

  addAmenity = async (name: string) => {
    const amenityExist = await Amenity.findOne({ name });
    if (amenityExist) {
      throw new Error("Amenity already exist");
    }

    try {
      const amenity = new Amenity({ name });
      await amenity.save();
      return amenity;
    } catch (error) {
      const _error = error as Error;
      throw new Error(_error.message);
    }
  };

  updateAmenity = async (id: string, name: string) => {
    const amenity = await Amenity.findByIdAndUpdate(
      id,
      { name },
      { new: true }
    );
    if (!amenity) {
      throw new Error("Amenity not found");
    }
    return amenity;
  };

  deleteAmenity = async (id: string) => {
    const amenity = await Amenity.findByIdAndDelete(id);
    if (!amenity) {
      throw new Error("Amenity not found");
    }
    return amenity;
  };

  getAllRoom = async () => {
    const rooms = await Room.find();
    if (!rooms) {
      throw new Error("No rooms found");
    }
    return rooms;
  };

  addRoomType = async (room_type_data: RoomType) => {
    const room_type = new RoomType(room_type_data);
    try {
      await room_type.save();
      return room_type;
    } catch (error) {
      const _error = error as Error;
      throw new Error(_error.message);
    }
  };

  addRoom = async (room_data: Room) => {
    const room = new Room(room_data);
    try {
      await room.save();
      return room;
    } catch (error) {
      const _error = error as Error;
      throw new Error(_error.message);
    }
  };
}