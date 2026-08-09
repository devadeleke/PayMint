import mongoose from "mongoose";
import Payment from "../models/payment.model.js";
import { AppError } from "../utils/appError.js";

export const getInvoicePayments = async (
    req,
    res,
    next
) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new AppError(
                "Invalid invoice ID.",
                400
            );
        }

        const payments = await Payment.find({
            invoice: id,
        })
            .populate(
                "createdBy",
                "fullName email"
            )
            .sort({
                paymentDate: -1,
            });

        return res.status(200).json({
            success: true,
            data: payments,
        });
    } catch (error) {
        next(error);
    }
};