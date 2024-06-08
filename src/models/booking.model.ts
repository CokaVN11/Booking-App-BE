import { Schema, model } from "mongoose";
const bookingSchema = new Schema(
  {
    hotel: {
      type: Schema.Types.ObjectId,
      ref: "Account",
      required: true,
    },
    room: {
      type: Schema.Types.ObjectId,
      ref: "Room",
      required: true,
    },
    customer: {
      type: Schema.Types.ObjectId,
      ref: "Account",
      required: true,
    },
    check_in: {
      type: Date,
      required: true,
    },
    check_out: {
      type: Date,
      required: true,
    },
    is_canceled: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: [
        "waiting",
        "approved",
        "rejected",
        "canceled",
        "completed",
        "staying",
      ],
      default: "waiting",
    },
  },
  { timestamps: true }
);

export const BookingModel = model("Booking", bookingSchema);

export default { BookingModel };
