import { Schema, model } from "mongoose";

const roomTypeSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    hotel: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Account"
    },
    description: {
        type: String,
        required: false,
    },
    price: {
        type: Number,
        required: true,
    },
    guest: {
        type: Number,
        required: true,
    },
    bedroom: {
        type: Number,
        required: true,
    },
    bathroom: {
        type: Number,
        required: true,
    },
    area: {
        type: Number,
        required: true,
    },
});

const roomSchema = new Schema({
    hotel: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Account"
    },
    room_type: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "RoomType"
    },
    name: {
        type: String,
        required: true,
    },
    is_accepted: {
        type: Boolean,
        default: false,
    },
    is_booked: {
        type: Boolean,
        default: false,
    },
    image:{
        type: [String],
    },
    amenities_ids: [
        {
            type: Schema.Types.ObjectId,
            ref: "Amenity"
        }
    ],
});

const amenitySchema = new Schema({
    name: {
        type: String,
        required: true,
    },
});


export const RoomType = model("RoomType", roomTypeSchema);
export const Room = model("Room", roomSchema);
export const Amenity = model("Amenity", amenitySchema);

export default {
    RoomType,
    Room,
    Amenity
}