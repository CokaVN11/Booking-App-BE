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
        enum: ['moderator', 'customer'],
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

notificationSchema.index({ booking: 1, status: 1, updatedAt: 1 });

export const NotificationModel = model('Notification', notificationSchema);

export default {NotificationModel};