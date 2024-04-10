import { prop, getModelForClass, Ref } from "@typegoose/typegoose";
import { Amenity } from "@src/types";
import { Account } from "./account.model";
import mongoose from "mongoose";

export class RoomType {
    @prop({ required: true })
    public name!: string;

    @prop({ ref: "Account", required: true })
    public hotel!: Ref<Account>;

    @prop({ required: true })
    public description!: string;

    @prop({ required: true })
    public price!: number;

    @prop({ required: true })
    public guest!: number;

    @prop({ required: true })
    public bedroom!: number;

    @prop({ required: true })
    public bathroom!: number;

    @prop({ required: true })
    public area!: number;
}

export class Room {
    @prop({ ref: "Account", required: true })
    public hotel!: Ref<Account>;

    @prop({ ref: "RoomType", required: true })
    public room_type!: Ref<RoomType>;

    @prop({ required: true })
    public name!: string;

    @prop({ default: false })
    is_accepted?: boolean;

    @prop({ default: false })
    is_booked?: boolean;

    @prop({ required: true })
    image!: mongoose.Types.Array<string>;
    
    @prop({ required: true })
    amenities!: mongoose.Types.Array<Amenity>;
}

export const RoomTypeModel = getModelForClass(RoomType);
export const RoomModel = getModelForClass(Room);

export default {
    RoomTypeModel,
    RoomModel
}