import {Schema, model} from 'mongoose';

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

export const BillModel = model('Bill', billSchema);

export default {BillModel};