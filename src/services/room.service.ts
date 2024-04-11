import { RoomModel } from "@models";

export class RoomService {
    private static instance?: RoomService;

    private constructor() { }

    static getInstance(): RoomService {
        if (!RoomService.instance) {
            RoomService.instance = new RoomService();
        }

        return RoomService.instance;
    }

    getAllRoom = async () => {
        const rooms = await RoomModel.find();
        if (!rooms) {
            throw new Error("No rooms found");
        }
        return rooms;
    };

    addRoom = async (room_data: Room) => {
        const roomExist = await RoomModel.findOne({ hotel: room_data.hotel, name: room_data.name });
        if (roomExist) {
            throw new Error("Room already exist");
        }
        try {
            const room = new RoomModel(room_data);
            await room.save();
            return room;
        } catch (error) {
            const _error = error as Error;
            throw new Error(_error.message);
        }
    }
}