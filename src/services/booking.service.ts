import { BookingModel } from "@models";
import { NotificationService, AccountService } from "@services";

export class BookingService {
    private static instance: BookingService | null = null;

    private constructor() { }

    static getInstance(): BookingService {
        if (!BookingService.instance) {
            BookingService.instance = new BookingService();
        }

        return BookingService.instance;
    }

    addBooking = async (booking: Booking) => {
        // check customer & hotel 
        const customer = await AccountService.getInstance().getAccount(booking.customer);
        if (!customer) throw new Error('Customer not found');
        const hotel = await AccountService.getInstance().getAccount(booking.hotel);
        if (!hotel) throw new Error('Hotel not found');

        try {
            const newBooking = new BookingModel(booking);
            await newBooking.save();

            const notification_data: Noti = {
                from_id: booking.customer,
                to_id: booking.hotel,
                for: 'hotelier',
                title: 'New booking',
                content: `New booking from ${customer.username}`,
                booking: newBooking._id.toString(),
                room: newBooking.room.toString(),
            };

            // add notification
            await NotificationService.getInstance().addNotification(notification_data);
            return newBooking;
        } catch (error) {
            const _error = error as Error;
            throw new Error(_error.message);
        }
    };


    getBookingOfCustomer = async (customer: string) => {
        try {
            const bookings = await BookingModel.find({ customer });
            return bookings;
        } catch (error) {
            const _error = error as Error;
            throw new Error(_error.message);
        }
    }

    getBookingOfHotel = async (hotel: string) => {
        try {
            const bookings = await BookingModel.find({ hotel });
            return bookings;
        } catch (error) {
            const _error = error as Error;
            throw new Error(_error.message);
        }
    }

    updateBookingDate = async (booking: Booking) => {
        try {
            const filter = { hotel: booking.hotel, room: booking.room, customer: booking.customer };
            const update = { check_in: booking.check_in, check_out: booking.check_out };
            const prev = await BookingModel.findByIdAndUpdate(filter, update, {new: true});

            NotificationService.getInstance().updateNotification({
                booking: prev?._id.toString() ?? '',
                from_id: booking.customer,
                to_id: booking.hotel,
                for: 'hotelier',
                title: 'Update booking',
                content: `Update booking from ${booking.customer}`,
                room: booking.room.toString(),
                is_read: false,
            });

            return await BookingModel.findOne(filter); // return updated booking
        } catch (error) {
            const _error = error as Error;
            throw new Error(_error.message);
        }
    }

    updateBookingStatus = async (booking: Booking) => {
        try {
            const filter = { hotel: booking.hotel, room: booking.room, customer: booking.customer };
            const update = { status: booking.status };
            const prev = await BookingModel.findByIdAndUpdate(filter, update, {new: true});

            NotificationService.getInstance().updateNotification({
                booking: prev?._id.toString() ?? '',
                from_id: booking.hotel,
                to_id: booking.customer,
                for: 'customer',
                title: 'Update booking',
                content: `Update booking from ${booking.customer}`,
                room: booking.room.toString(),
                status: booking.status,
                is_read: false,
            });

            return await BookingModel.findOne(filter); // return updated booking
        } catch (error) {
            const _error = error as Error;
            throw new Error(_error.message);
        }
    }

    deleteBooking = async (id: string) => {
        const booking = await BookingModel.findByIdAndDelete(id);
        if (!booking) {
            throw new Error("Booking not found");
        }
        return booking;
    }
}