import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
    {
        invoice: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Invoice",
            required: true,
        },

        client: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Client",
            required: true,
        },

        amount: {
            type: Number,
            required: true,
            min: 0.01,
        },

        paymentDate: {
            type: Date,
            default: Date.now,
        },

        paymentMethod: {
            type: String,
            trim: true,
            enum: [
                "cash",
                "bank_transfer",
                "card",
                "mobile_money",
                "other",
            ],
            default: "bank_transfer",
        },

        reference: {
            type: String,
            trim: true,
        },

        notes: {
            type: String,
            trim: true,
        },

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

paymentSchema.index({
    invoice: 1,
});

paymentSchema.index({
    client: 1,
});

paymentSchema.index({
    paymentDate: -1,
});

const Payment = mongoose.model("Payment", paymentSchema);

export default Payment;