// User login --> Booking (Pending) --> Payment (Unpaid) --> SSLCommerz --> Booking Update => Confirm --> Payment => update => paid

import { Types } from "mongoose";

export enum BOOKING_STATUS {
    PENDING = "pending",
    COMPLETE = "complete",
    CANCEL = "cancel",
    FAILED = "failed",

}

export interface IBooking {
    user: Types.ObjectId;
    tour: Types.ObjectId;
    payment?: Types.ObjectId;
    guestCount: number;
    status: BOOKING_STATUS;
}