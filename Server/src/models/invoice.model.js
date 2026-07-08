import mongoose from 'mongoose';
import { INVOICE_STATUS, PAYMENT_STATUS } from '../constants/invoice.constants.js';

const invoiceItemSchema = new mongoose.Schema(
    {
        description: {
            type: String,
            requitred: true,
            trim: true
        },

        quantity: {
            type: Number,
            required: true,
            min: 1
        },

        unitPrice: {
            type: Number,
            required: true,
            min: 0,
        },

        amount: {
            type: Number,
            required: true,
            min: 0,
        },
    },

    { _id: false}
);

const invoiceSchema = new mongoose.Schema(
    {
        client: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Client',
            required: true
        },

        invoiceNumber: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },

        title: {
            type: String,
            required: true,
            trim: true,
        },

        description: {
            type: String,
            trim: true,
        },

        issueDate: {
            type: Date,
            default: Date.now,
        },

        dueDate: {
            type: Date,
            required: true,
        },

        items: {
            type: [invoiceItemSchema],
            validate: {
                validator: function (value) {
                    return value.length > 0;
                },
                message: 'Invoice must contain at least one item.',
            },
        },

        subtotal: {
            type: Number,
            required: true,
            min: 0,
        },

        tax: {
            type: Number,
            default: 0,
            min: 0,
        },

        discount: {
            type: Number,
            default: 0,
            min: 0,
        },

        total: {
            type: Number,
            required: true,
            min: 0,
        },

        currency: {
            type: String,
            default: 'NGN',
            uppercase: true,
            trim: true,
        },

        status: {
            type: String,
            enum: Object.values(INVOICE_STATUS),
            default: INVOICE_STATUS.DRAFT,
        },

        paymentStatus: {
            type: String,
            enum: Object.values(PAYMENT_STATUS),
            default: PAYMENT_STATUS.UNPAID,
        },

        notes: {
            type: String,
            trim: true,
        },

        isArchived: {
            type: Boolean,
            default: false,
        },

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
    },

    { timestamps: true}
);

const Invoice = mongoose.model('Invoice', invoiceSchema);
export default Invoice;