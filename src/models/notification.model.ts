import { NotificationStatus, Role } from '@src/types';
import { Ref, getModelForClass, prop } from '@typegoose/typegoose';
import { Account } from './account.model';
import { Booking } from './booking.model';
import { Room } from './room.model';

export class Notification {
    @prop({ ref: () => Account, required: true })
    public from_id!: Ref<Account>;
    
    @prop({ ref: () => Account, required: true })
    public to_id!: Ref<Account>;

    @prop({ enum: Role, required: true })
    for!: Role;

    @prop({ required: true })
    public title!: string;

    @prop({ required: true })
    public content!: string;

    @prop({ enum: NotificationStatus, default: NotificationStatus.waiting })
    public status?: NotificationStatus;

    @prop({ ref: () => Booking })
    public booking?: Ref<Booking>;

    @prop({ ref: () => Room})
    public room?: Ref<Room>;

    @prop({ default: false })
    public is_read?: boolean;
}

export class Report {
    @prop({ ref: () => Booking, required: true })
    public booking!: Ref<Booking>;

    @prop({ ref: () => Account, required: true })
    public hotel!: Ref<Account>;

    @prop({ required: true })
    public title!: string;

    @prop({ required: true })
    public content!: string;

    @prop({ default: false })
    public is_read?: boolean;
}

export class Rating {
    @prop({ ref: () => Account, required: true })
    public customer!: Ref<Account>;

    @prop({ ref: () => Account, required: true })
    public hotel!: Ref<Account>;

    @prop({ ref: () => Room, required: true })
    public room!: Ref<Room>;

    @prop({ required: true })
    public content!: string;

    @prop({ min: 0, max: 5, default: 0 })
    public star!: number;
}

export const NotificationModel = getModelForClass(Notification)
export const ReportModel = getModelForClass(Report)
export const RatingModel = getModelForClass(Rating)

export default {
    NotificationModel,
    ReportModel,
    RatingModel,
};