import { Schema, model } from 'mongoose';
const notificationSchema = new Schema({
    from_id: {
        type: Schema.Types.ObjectId,
        ref: 'Account',
        required: true,
    },
    to_id: {
        type: Schema.Types.ObjectId,
        ref: 'Account',
        required: true,
    },
    for: {
        type: String,
        enum: ['hotelier', 'customer'],
    },
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['accepted', 'cancelled', 'waiting', 'warning', 'approved', 'rejected'],
        default: 'waiting',
    },
    booking: {
        type: Schema.Types.ObjectId,
        ref: 'Booking',
    },
    room: {
        type: String,
        ref: 'Room',
    },
    is_read: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });

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

const ratingSchema = new Schema({
    customer: {
        type: Schema.Types.ObjectId,
        ref: 'Account',
        required: true,
    },
    hotel: {
        type: Schema.Types.ObjectId,
        ref: 'Account',
        required: true,
    },
    room: {
        type: String,
        ref: 'Room',
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    star: {
        type: Number,
        min: 0,
        max: 5,
        default: 0,
    },
}, { timestamps: true });

notificationSchema.index({ booking: 1, status: 1, updatedAt: 1 }); 
reportSchema.index({ booking: 1, updatedAt: 1 });
ratingSchema.index({ updatedAt: 1 });

export const Notification = model('Notification', notificationSchema);
export const Report = model('Report', reportSchema);
export const Rating = model('Rating', ratingSchema);

export default {
    Notification,
    Report,
    Rating,
};