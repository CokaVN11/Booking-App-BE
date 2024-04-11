import {Schema, model} from 'mongoose';

const reportSchema = new Schema({
    booking: {
        type: Schema.Types.ObjectId,
        ref: 'Booking',
        required: true,
    },
    hotel: {
        type: Schema.Types.ObjectId,
        ref: 'Account',
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    is_read: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });

reportSchema.index({ booking: 1, updatedAt: 1 });

export const ReportModel = model('Report', reportSchema);

export default {ReportModel};