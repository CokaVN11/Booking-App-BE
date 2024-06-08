import { Schema, model } from "mongoose";

const roomTypeSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  hotel: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Account",
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

export const RoomTypeModel = model("RoomType", roomTypeSchema);

export default { RoomTypeModel };
