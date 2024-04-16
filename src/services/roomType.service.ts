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
}