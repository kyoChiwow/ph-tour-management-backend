import httpStatus from "http-status-codes";
import AppError from "../../errorHelpers/AppError";
import { PAYMENT_STATUS } from "../payment/payment.interface";
import { Payment } from "../payment/payment.model";
import { Tour } from "../tour/tour.model";
import { User } from "../user/user.model";
import { BOOKING_STATUS, IBooking } from "./booking.interface";
import { Booking } from "./booking.model";

const getTransactionId = () => {
  return `tran_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
};

const createBooking = async (payload: Partial<IBooking>, userId: string) => {
  const transactionId = getTransactionId();

  const session = await Booking.startSession();
  session.startTransaction();

  try {
    const user = await User.findById(userId, session);

    if (!user?.phone || !user.address) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "Please update your profile to book a tour!"
      );
    }

    const tour = await Tour.findById(payload.tour, session).select("costFrom");

    if (!tour?.costFrom) {
      throw new AppError(httpStatus.BAD_REQUEST, "Tour cost not found!");
    }

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const amount = Number(tour.costFrom) * Number(payload.guestCount!);

    const booking = await Booking.create({
      user: userId,
      status: BOOKING_STATUS.PENDING,
      ...payload,
    }, { session });

    const payment = await Payment.create({
      booking: booking[0]._id,
      status: PAYMENT_STATUS.UNPAID,
      transactionId: transactionId,
      amount: amount,
    });

    const updatedBooking = await Booking.findByIdAndUpdate(
      booking._id,
      { payment: payment._id },
      { new: true, runValidators: true }
    )
      .populate("user", "name email phone address")
      .populate("tour", "title costFrom")
      .populate("payment");

    return updatedBooking;
  } catch (error) {
    
  }
};

export const BookingService = {
  createBooking,
};
