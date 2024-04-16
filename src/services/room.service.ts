import { RoomModel } from "@models";
import { AccountService, RoomTypeService, AmenityService } from "@services";

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
        try {    
            const rooms = await RoomModel.find();
            if (rooms.length === 0) {
                throw new Error("No rooms found");
            }
            return rooms;
        } catch (error) {
            const _error = error as Error;
            throw new Error(_error.message);
        }
    };

    getRoomByHotelId = async (hotel_id: string, room_type?: string, is_accepted?: boolean, is_booked?: boolean) => {
        try {
            const rooms = await RoomModel.find({
                hotel: hotel_id,
                ...(room_type && { room_type: room_type }),
                ...(is_accepted != undefined && { is_accepted: is_accepted }),
                ...(is_booked != undefined && { is_booked: is_booked })
            })
            if (rooms.length === 0) {
                throw new Error("No rooms found");
            }
            return rooms;
        } catch (error) {
            const _error = error as Error;
            throw new Error(_error.message);
        }
    }

    getRoomByType = async (room_type: string) => {
        try {
            const rooms = await RoomModel.find({ room_type: room_type });
            if (rooms.length === 0) {
                throw new Error("No rooms found");
            }
            return rooms;
        } catch (error) {
            const _error = error as Error;
            throw new Error(_error.message);
        }
    }

    getAccepetedRoom = async () => {
        try {
            const rooms = await RoomModel.find({is_accepted: true});
            if (rooms.length === 0) {
                throw new Error("No rooms found");
            }
            return rooms;
        } catch (error) {
            const _error = error as Error;
            throw new Error(_error.message);
        }   
    }

    getBookedRoom = async () => {
        try {
            const rooms = await RoomModel.find({is_booked: true});
            if (rooms.length === 0) {
                throw new Error("No rooms found");
            }
            return rooms;
        } catch (error) {
            const _error = error as Error;
            throw new Error(_error.message);
        } 
    }

    addRoom = async (room_data: Room) => {
        // Check exist
        const roomExist = await RoomModel.findOne({ hotel: room_data.hotel, name: room_data.name });
        if (roomExist) {
            throw new Error("Room already exist");
        }

        // Check hotel
        const isHotelExist = await AccountService.getInstance().checkHotelId(room_data.hotel);
        if(!isHotelExist) {
            throw new Error("Hotel not found");
        }

        // Check room_type
        const isRoomTypeExist = await RoomTypeService.getInstance().checkRoomTypeId(room_data.room_type);
        if(!isRoomTypeExist) {
            throw new Error("Room type not found");
        }

        // Check amenities
        const isAmenitiesExist = await AmenityService.getInstance().checkListAmenity(room_data.amenities_ids);
        if(!isAmenitiesExist) {
            throw new Error("Some of the amenities not found");
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

    updateRoom = async (room_id: string, room_data: Room) => {
        // Check hotel
        if(room_data.hotel != undefined) {
            const isHotelExist = await AccountService.getInstance().checkHotelId(room_data.hotel);
            if(!isHotelExist) {
                throw new Error("Hotel not found");
            }
        }
        // Check room_type
        if(room_data.room_type != undefined) {
            const isRoomTypeExist = await RoomTypeService.getInstance().checkRoomTypeId(room_data.room_type);
            if(!isRoomTypeExist) {
                throw new Error("Room type not found");
            }
        }
        // Check amenities
        if(room_data.amenities_ids != undefined) {
            const isAmenitiesExist = await AmenityService.getInstance().checkListAmenity(room_data.amenities_ids);
            if(!isAmenitiesExist) {
                throw new Error("Some of the amenities not found");
            }
        }

        try {
            const room = await RoomModel.findByIdAndUpdate(room_id, room_data, { new: true });
            if (!room) {
                throw new Error("Room not found");
            }
            return room;
        } catch (error) {
            const _error = error as Error;
            throw new Error(_error.message);
        }
    }

    deleteRoom = async (room_id: string) => {
        try {
            const room = await RoomModel.findByIdAndDelete(room_id);
            if (!room) {
                throw new Error("Room not found");
            }
            return room;
        } catch (error) {
            const _error = error as Error;
            throw new Error(_error.message);
        }
    }
}