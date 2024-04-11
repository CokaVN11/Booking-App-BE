import {Schema, model} from "mongoose";

const amenitySchema = new Schema({
    name: {
        type: String,
        required: true,
    },
});

export const AmenityModel = model("Amenity", amenitySchema);

export default {AmenityModel};