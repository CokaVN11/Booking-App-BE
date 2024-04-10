import { RoomModel } from "@/models";

export class RoomService {
    private static instance: RoomService | null = null;

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