import { Schema, model } from "mongoose";

const roomSchema = new Schema({
  hotel: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Account",
  },
  room_type: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "RoomType",
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
  image: {
    type: [String],
  },
  amenities_ids: [
    {
      type: Schema.Types.ObjectId,
      ref: "Amenity",
    },
  ],
});

export const RoomModel = model("Room", roomSchema);

export default { RoomModel };
