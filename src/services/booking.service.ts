import { BookingModel } from "@models";
import { NotificationService, AccountService } from "@services";
import { ObjectId } from "mongodb";

export class BookingService {
  private static instance: BookingService | null = null;
  private notiService: NotificationService = NotificationService.getInstance();
  private accountService: AccountService = AccountService.getInstance();

  private constructor() {}

  static getInstance(): BookingService {
    if (!BookingService.instance) {
      BookingService.instance = new BookingService();
    }

    return BookingService.instance;
  }

  addBooking = async (booking: Booking) => {
    // check customer & hotel
    const customer = await this.accountService.getAccount(booking.customer);
    if (!customer) throw new Error("Customer not found");
    const hotel = await this.accountService.getAccount(booking.hotel);
    if (!hotel) throw new Error("Hotel not found");

    try {
      const newBooking = new BookingModel(booking);
      await newBooking.save();

      const notification_data: Noti = {
        from_id: booking.customer,
        to_id: booking.hotel,
        for: "moderator",
        title: "New booking",
        content: `New booking from ${customer.username}`,
        booking: newBooking._id.toString(),
        room: newBooking.room.toString(),
      };

      // add notification
      await this.notiService.addNotification(notification_data);
      return newBooking;
    } catch (error) {
      const _error = error as Error;
      throw new Error(_error.message);
    }
  };

  getBookingOfCustomer = async (customer: string) => {
    try {
      const bookings = await BookingModel.aggregate(
        reservationPipeLine(customer)
      );
      return bookings;
    } catch (error) {
      const _error = error as Error;
      throw new Error(_error.message);
    }
  };

  getBookingOfHotel = async (hotel: string) => {
    try {
      const bookings = await BookingModel.find({ hotel });
      return bookings;
    } catch (error) {
      const _error = error as Error;
      throw new Error(_error.message);
    }
  };

  getDetailBooking = async (id: string) => {
    try {
      const booking = await BookingModel.aggregate(
        detailReservationPipeLine(id)
      );

      return booking;
    } catch (error) {
      const _error = error as Error;
      throw new Error(_error.message);
    }
  };

  deleteBooking = async (id: string) => {
    const booking = await BookingModel.findByIdAndDelete(id);
    if (!booking) {
      throw new Error("Booking not found");
    }
    return booking;
  };

  getAllWaitingBooking = async (hotel_id: string) => {
    try {
      const bookings = await BookingModel.aggregate(
        bookingPipeLine(hotel_id, "waiting")
      );
      const data = bookings.map((booking) => {
        return {
          ...booking,
          checkIn: booking.check_in,
          checkOut: booking.check_out,
        };
      });
      return data;
    } catch (error) {
      const _error = error as Error;
      throw new Error(_error.message);
    }
  };

  getAllAcceptedBooking = async (hotel_id: string) => {
    try {
      const bookings = await BookingModel.aggregate(
        bookingPipeLine(hotel_id, "approved")
      );
      const data = bookings.map((booking) => {
        return {
          ...booking,
          checkIn: booking.check_in,
          checkOut: booking.check_out,
        };
      });
      return data;
    } catch (error) {
      const _error = error as Error;
      throw new Error(_error.message);
    }
  };

  updateBookingDate = async (booking: Booking) => {
    try {
      const filter = {
        hotel: booking.hotel,
        room: booking.room,
        customer: booking.customer,
      };
      const update = {
        check_in: booking.check_in,
        check_out: booking.check_out,
      };
      const prev = await BookingModel.findByIdAndUpdate(filter, update, {
        new: true,
      });

      this.notiService.updateNotification({
        booking: prev?._id.toString() ?? "",
        from_id: booking.customer,
        to_id: booking.hotel,
        for: "hotelier",
        title: "Update booking",
        content: `Update booking from ${booking.customer}`,
        room: booking.room.toString(),
        is_read: false,
      });

      return await BookingModel.findOne(filter); // return updated booking
    } catch (error) {
      const _error = error as Error;
      throw new Error(_error.message);
    }
  };
  getAllStayingBooking = async (hotel_id: string) => {
    try {
      const bookings = await BookingModel.aggregate(
        bookingPipeLine(hotel_id, "staying")
      );
      const data = bookings.map((booking) => {
        return {
          ...booking,
          checkIn: booking.check_in,
          checkOut: booking.check_out,
        };
      });
      return data;
    } catch (error) {
      const _error = error as Error;
      throw new Error(_error.message);
    }
  };
  async updateBookingStatusById(
    bookingId: string,
    status: string,
    notificationTitle: string,
    notificationContent: string
  ): Promise<Booking> {
    try {
      const booking = await BookingModel.findByIdAndUpdate(
        bookingId,
        { status },
        { new: true }
      );

      if (!booking) {
        throw new Error("Booking not found");
      }

      const hotel = await this.accountService.getAccount(
        booking.hotel.toString()
      );

      await this.notiService.updateNotification({
        from_id: booking.hotel.toString(),
        to_id: booking.customer.toString(),
        for: "customer",
        title: notificationTitle,
        content: `${notificationContent} ${hotel.hotel_name}`,
        booking: booking._id.toString(),
        room: booking.room.toString(),
      });

      return booking;
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }
  acceptBooking = async (booking_id: string) =>
    this.updateBookingStatusById(
      booking_id,
      "approved",
      "Booking accepted",
      "Your booking has been accepted by"
    );

  rejectBooking = async (booking_id: string) =>
    this.updateBookingStatusById(
      booking_id,
      "rejected",
      "Booking rejected",
      "Your booking has been rejected by"
    );

  checkInBooking = async (booking_id: string) =>
    this.updateBookingStatusById(
      booking_id,
      "staying",
      "Check-in",
      "Your booking has been checked-in by"
    );

  checkOutBooking = async (booking_id: string) =>
    this.updateBookingStatusById(
      booking_id,
      "completed",
      "Check-out",
      "Your booking has been checked-out by"
    );
}

const commonReservationPipeLine = [
  {
    $lookup: {
      from: "rooms",
      localField: "room",
      foreignField: "_id",
      as: "room",
    },
  },
  {
    $lookup: {
      from: "roomtypes",
      localField: "room_type",
      foreignField: "_id",
      as: "roomtype",
    },
  },
  {
    $lookup: {
      from: "accounts",
      localField: "customer",
      foreignField: "_id",
      as: "customer",
    },
  },
  {
    $lookup: {
      from: "accounts",
      localField: "hotel",
      foreignField: "_id",
      as: "hotel",
    },
  },
  {
    $unwind: "$room",
  },
  {
    $unwind: "$customer",
  },
  {
    $unwind: "$hotel",
  },
  {
    $unwind: "$roomtype",
  },
  {
    $project: {
      _id: 1,
      hotel_id: "$hotel._id",
      hotel: "$hotel.hotel_name",
      room: "$room.name",
      roomtype: "$roomtype.name",
      price: "$roomtype.price",
      image: "$room.image",
      status: 1,
      customer: "$customer.username",
      check_in: 1,
      check_out: 1,
      is_canceled: 1,
      createdAt: 1,
      updatedAt: 1,
    },
  },
];
const bookingPipeLine = (hotel_id: string, status?: string) => [
  {
    $match: {
      status: status,
      hotel: new ObjectId(hotel_id),
    },
  },
  ...commonReservationPipeLine,
];

const reservationPipeLine = (customer: string) => [
  {
    $match: {
      customer: new ObjectId(customer),
    },
  },
  ...commonReservationPipeLine,
];

const detailReservationPipeLine = (id: string) => [
  {
    $match: {
      _id: new ObjectId(id),
    },
  },
  ...commonReservationPipeLine,
];
