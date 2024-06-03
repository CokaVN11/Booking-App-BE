import { RoomModel } from '@models';
import { AccountService, RoomTypeService, AmenityService } from '@services';
import mongoose from 'mongoose';

export class RoomService {
  private static instance?: RoomService;

  private constructor() {}

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
        throw new Error('No rooms found');
      }
      return rooms;
    } catch (error) {
      const _error = error as Error;
      throw new Error(_error.message);
    }
  };

  deleteRoom = async (room_id: string) => {
    try {
      const room = await RoomModel.findByIdAndDelete(room_id);
      if (!room) {
        throw new Error('Room not found');
      }
      return room;
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
        ...(is_booked != undefined && { is_booked: is_booked }),
      });

      if (rooms.length === 0) {
        throw new Error('No rooms found');
      }

      const data = rooms.map((room) => {
        return {
          _id: room._id,
          name: room.name,
          hotel: room.hotel,
          roomType: room.room_type,
          amenitiesIds: room.amenities_ids,
          isAccepted: room.is_accepted,
          isBooked: room.is_booked,
          image: room.image,
        };
      });

      return data;
    } catch (error) {
      const _error = error as Error;
      throw new Error(_error.message);
    }
  };

  getRoomByType = async (room_type: string) => {
    try {
      const rooms = await RoomModel.find({ room_type: room_type });
      if (rooms.length === 0) {
        throw new Error('No rooms found');
      }
      return rooms;
    } catch (error) {
      const _error = error as Error;
      throw new Error(_error.message);
    }
  };

  getAccepetedRoom = async () => {
    try {
      const rooms = await RoomModel.find({ is_accepted: true });
      if (rooms.length === 0) {
        throw new Error('No rooms found');
      }
      return rooms;
    } catch (error) {
      const _error = error as Error;
      throw new Error(_error.message);
    }
  };

  getBookedRoom = async () => {
    try {
      const rooms = await RoomModel.find({ is_booked: true });
      if (rooms.length === 0) {
        throw new Error('No rooms found');
      }
      return rooms;
    } catch (error) {
      const _error = error as Error;
      throw new Error(_error.message);
    }
  };

  validateRoomData = async (room_data: Room) => {
    const [isHotelExist, isRoomTypeExist, isAmenitiesExist] = await Promise.all([
      AccountService.getInstance().checkHotelId(room_data.hotel),
      RoomTypeService.getInstance().checkRoomTypeId(room_data.room_type),
      AmenityService.getInstance().checkListAmenity(room_data.amenities_ids),
    ]);

    if (!isHotelExist) {
      throw new Error('Hotel not found');
    }

    if (!isRoomTypeExist) {
      throw new Error('Room type not found');
    }

    if (!isAmenitiesExist) {
      throw new Error('Some of the amenities not found');
    }
  };

  addRoom = async (room_data: Room) => {
    const hotel_id = await AccountService.getInstance().getHotelIdByName(room_data.hotel);
    // Check exist
    const roomExist = await RoomModel.findOne({
      hotel: hotel_id,
      name: room_data.name,
    });
    if (roomExist) {
      throw new Error('Room already exist');
    }

    const room_type_id = await RoomTypeService.getInstance().getRoomTypeIdByName(room_data.room_type);

    console.log(room_type_id);

    const { name, is_accepted, is_booked, image, amenities_ids } = room_data;

    try {
      const room = new RoomModel({
        hotel: hotel_id,
        room_type: room_type_id,
        name,
        is_accepted,
        is_booked,
        image,
        amenities_ids,
      });
      await room.save();
      return room;
    } catch (error) {
      const _error = error as Error;
      console.log(_error.message);
      throw new Error(_error.message);
    }
  };

  updateRoom = async (room_id: string, room_data: Room) => {
    // Check hotel
    if (room_data.hotel != undefined) {
      const isHotelExist = await AccountService.getInstance().checkHotelId(room_data.hotel);
      if (!isHotelExist) {
        throw new Error('Hotel not found');
      }
    }
    // Check room_type
    if (room_data.room_type != undefined) {
      const isRoomTypeExist = await RoomTypeService.getInstance().checkRoomTypeId(room_data.room_type);
      if (!isRoomTypeExist) {
        throw new Error('Room type not found');
      }
    }
    // Check amenities
    if (room_data.amenities_ids != undefined) {
      const isAmenitiesExist = await AmenityService.getInstance().checkListAmenity(room_data.amenities_ids);
      if (!isAmenitiesExist) {
        throw new Error('Some of the amenities not found');
      }
    }

    try {
      const room = await RoomModel.findByIdAndUpdate(room_id, room_data, {
        new: true,
      });
      if (!room) {
        throw new Error('Room not found');
      }
      return room;
    } catch (error) {
      const _error = error as Error;
      throw new Error(_error.message);
    }
  };

  getPriceRange = async (hotel_id: string) => {
    try {
      const minPricePipeline = [
        {
          $match: { hotel: new mongoose.Types.ObjectId(hotel_id) },
        },
        {
          $lookup: {
            from: 'roomtypes',
            localField: 'room_type',
            foreignField: '_id',
            as: 'roomType',
          },
        },
        {
          $unwind: '$roomType',
        },
        {
          $group: {
            _id: null,
            minPrice: { $min: '$roomType.price' },
          },
        },
      ];

      const maxPricePipeline = [
        {
          $match: { hotel: new mongoose.Types.ObjectId(hotel_id) },
        },
        {
          $lookup: {
            from: 'roomtypes',
            localField: 'room_type',
            foreignField: '_id',
            as: 'roomType',
          },
        },
        {
          $unwind: '$roomType',
        },
        {
          $group: {
            _id: null,
            maxPrice: { $max: '$roomType.price' },
          },
        },
      ];

      const [minPrice, maxPrice] = await Promise.all([
        RoomModel.aggregate(minPricePipeline),
        RoomModel.aggregate(maxPricePipeline),
      ]);

      return {
        min: minPrice[0]?.minPrice || 0,
        max: maxPrice[0]?.maxPrice || 0,
      };
    } catch (error) {
      const _error = error as Error;
      throw new Error(_error.message);
    }
  };

  getAmenitiesByHotelId = async (hotel_id: string) => {
    try {
      const rooms = await RoomModel.find({
        hotel: new mongoose.Types.ObjectId(hotel_id),
      });
      if (rooms.length === 0) {
        throw new Error('No rooms found');
      }

      let amenities: string[] = [];

      rooms.forEach((room) => {
        amenities = amenities.concat(room.amenities_ids.toString().split(','));
      });

      const uniqueAmenities = Array.from(new Set(amenities));

      const data = await AmenityService.getInstance().getListAmenity(uniqueAmenities);

      return data;
    } catch (error) {
      const _error = error as Error;
      throw new Error(_error.message);
    }
  };

  getFullRoomDetailByHotelId = async (hotel_id: string) => {
    try {
      const pipeLine = [
        {
          $match: { hotel: new mongoose.Types.ObjectId(hotel_id) },
        },
        {
          $lookup: {
            from: 'roomtypes',
            localField: 'room_type',
            foreignField: '_id',
            as: 'roomType',
          },
        },
        {
          $unwind: '$roomType',
        },
        {
          $project: {
            _id: 1,
            name: 1,
            room_type: '$roomType.name',
            is_accepted: 1,
            is_booked: 1,
            image: 1,
            amenities_ids: 1,
            hotel: 1,
            description: '$roomType.description',
            price: '$roomType.price',
            guest: '$roomType.guest',
            bedroom: '$roomType.bedroom',
            bathroom: '$roomType.bathroom',
            area: '$roomType.area',
          },
        },
      ];

      let data = await RoomModel.aggregate(pipeLine);

      data = data.map((room) => {
        return {
          _id: room._id,
          name: room.name,
          roomType: room.room_type,
          isAccepted: room.is_accepted,
          isBooked: room.is_booked,
          amenitiesIds: room.amenities_ids,
          image: room.image,
          hotel: room.hotel,
          description: room.description,
          price: room.price,
          guest: room.guest,
          bedroom: room.bedroom,
          bathroom: room.bathroom,
          area: room.area,
        };
      });

      return data;
    } catch (error) {
      const _error = error as Error;
      throw new Error(_error.message);
    }
  };
}
