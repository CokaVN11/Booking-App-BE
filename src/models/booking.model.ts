import mongoose from 'mongoose'
import { Account } from './account.model'
import { Ref, getModelForClass, prop } from '@typegoose/typegoose'
import { Room } from './room.model'

enum BookingStatus {
  waiting = 'waiting',
  approved = 'approved',
  rejected = 'rejected',
  canceled = 'canceled',
  completed = 'completed',
  staying = 'staying'
}

enum BillStatus {
  waiting = 'waiting',
  paid = 'paid',
  canceled = 'canceled'
}

export class Booking {
  @prop({ ref: () => Account, required: true })
  public customer!: Ref<Account>

  @prop({ ref: () => Room, required: true })
  public room!: Ref<Room>

  @prop({ ref: () => Account, required: true })
  public hotel!: Ref<Account>

  @prop({ required: true })
  public check_in!: Date

  @prop({ required: true })
  public check_out!: Date

  @prop({ default: false })
  is_accepted?: boolean

  @prop({ enum: BookingStatus, default: BookingStatus.waiting })
  status?: BookingStatus
}

export class Bill {
  @prop({ ref: () => Account, required: true })
  public customer!: Ref<Account>

  @prop({ required: true })
  public total!: number

  @prop({ enum: BillStatus, default: BillStatus.waiting })
  public status?: BillStatus

  @prop({ type: () => mongoose.Types.Array<Booking>, default: [] })
  public bookings?: mongoose.Types.Array<Booking>
}

export const BookingModel = getModelForClass(Booking)
export const BillModel = getModelForClass(Bill)

export default {
  BookingModel,
  BillModel
}
