/* eslint-disable @typescript-eslint/no-explicit-any */
import { Types } from "mongoose";

export enum PAYMENT_STATUS {
    PAID = "paid",
    UNPAID = "unpaid",
    FAILED = "failed",
    CANCELLED = "cancelled",
    REFUNDED = "refunded",

}

export interface IPayment {
    booking : Types.ObjectId;
    transactionId : string;
    amount : number;
    paymentGatewayData ?: any;
    invoiceUrl ?: string;
    status : PAYMENT_STATUS;
}