import {Schema, model} from 'mongoose';

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

ratingSchema.index({ updatedAt: 1 });

export const RatingModel = model('Rating', ratingSchema);

export default {RatingModel};