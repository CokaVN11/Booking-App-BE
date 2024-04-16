import { RoomTypeModel } from "@models";

export class RoomTypeService {
    private static instance: RoomTypeService | null = null;

    private constructor() { }

    static getInstance(): RoomTypeService {
        if (!RoomTypeService.instance) {
            RoomTypeService.instance = new RoomTypeService();
        }

        return RoomTypeService.instance;
    }

    getAllRoomType = async () => {
        try {
            const room_types = await RoomTypeModel.find();
            
            if(!room_types) {
                throw new Error("No room type found");
            }
            return room_types;
        } catch (error) {
            const _error = error as Error;
            throw new Error(_error.message);
        }
    }

    getRoomTypeByHotelId = async (hotel_id: string) => {
        try {
            const room_types = await RoomTypeModel.find({ hotel: hotel_id });
            if (room_types.length === 0) {
                throw new Error("No room type found");
            }
            return room_types;
        } catch (error) {
            const _error = error as Error;
            throw new Error(_error.message);
        }
    }

    addRoomType = async (room_type_data: RoomType) => {
        const roomTypeExist = await RoomTypeModel.findOne({ hotel: room_type_data.hotel, name: room_type_data.name });
        if (roomTypeExist) {
            throw new Error("Room type already exist");
        }
        try {
            const room_type = new RoomTypeModel(room_type_data);
            await room_type.save();
            return room_type;
        } catch (error) {
            const _error = error as Error;
            throw new Error(_error.message);
        }
    }

    updateRoomType = async (room_type_id: string, room_type_data: RoomType) => {
        try {
            const room_type = await RoomTypeModel.findByIdAndUpdate(room_type_id, room_type_data, { new: true });
            if (!room_type) {
                throw new Error("Room type not found");
            }
            return room_type;
        } catch (error) {
            const _error = error as Error;
            throw new Error(_error.message);
        }
    }

    deleteRoomType = async (room_type_id: string) => {
        try {
            const room_type = await RoomTypeModel.findByIdAndDelete(room_type_id);
            if (!room_type) {
                throw new Error("Room type not found");
            }
            return room_type;
        } catch (error) {
            const _error = error as Error;
            throw new Error(_error.message);
        }
    }
}