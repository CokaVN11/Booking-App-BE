import { Schema, model } from "mongoose";
const bookingSchema = new Schema({
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
        enum: ["waiting", "approved", "rejected", "canceled", "completed", "staying"],
        default: "waiting",
    },
}, { timestamps: true });

const billSchema = new Schema({
    customer: {
        type: Schema.Types.ObjectId,
        ref: "Account",
        required: true,
    },
    total: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ["waiting", "paid", "canceled"],
        default: "waiting",
    },
    bookings: [{
        type: Schema.Types.ObjectId,
        ref: "Booking",
    }],
}, { timestamps: true });

export const Booking = model("Booking", bookingSchema);
export const Bill = model("Bill", billSchema);

export default {
    Booking,
    Bill,
};