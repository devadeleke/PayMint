import mongoose from 'mongoose';
import { INVOICE_STATUS, PAYMENT_STATUS } from '../constants/invoice.constants.js';
import { AppError } from '../utils/appError.js';

const invoiceItemSchema = new mongoose.Schema(
    {
        description: {
            type: String,
            required: true,
            trim: true,
        },

        quantity: {
            type: Number,
            required: true,
            min: 1,
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
    { _id: false }
);

const invoiceSchema = new mongoose.Schema(
    {
        client: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Client',
            required: true,
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
                validator: (items) => items.length > 0,
                message: 'Invoice must contain at least one item.',
            },
        },

        subTotal: {
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

        amountPaid: {
            type: Number,
            default: 0,
            min: 0,
        },

        balanceDue: {
            type: Number,
            default: 0,
            min: 0,
        },

        lastPaymentDate: {
            type: Date,
        },

        currency: {
            type: String,
            default: 'USD',
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
            required: true,
        },
    },
    {
        timestamps: true,
    }
);


// ============================================
// VALIDATE PAYMENT & CALCULATE BALANCE
// ============================================

// ============================================
// INVOICE PAYMENT VALIDATION & CALCULATIONS
// ============================================

invoiceSchema.pre("save", function () {
    if (this.amountPaid > this.total) {
        throw new AppError(
            "Amount paid cannot exceed invoice total.",
            400
        );
    }

    this.balanceDue = this.total - this.amountPaid;

    if (this.amountPaid === 0) {
        this.paymentStatus = PAYMENT_STATUS.UNPAID;
    } else if (this.amountPaid < this.total) {
        this.paymentStatus = PAYMENT_STATUS.PARTIALLY_PAID;
    } else {
        this.paymentStatus = PAYMENT_STATUS.PAID;
    }
});


// ============================================
// AUTOMATICALLY UPDATE PAYMENT STATUS
// ============================================


// ============================================
// INDEXES
// ============================================

invoiceSchema.index({
    client: 1,
});

invoiceSchema.index({
    paymentStatus: 1,
});

invoiceSchema.index({
    dueDate: 1,
});

invoiceSchema.index({
    status: 1,
});

invoiceSchema.index({
    isArchived: 1,
});

invoiceSchema.index({
    createdAt: -1,
});


const Invoice = mongoose.model('Invoice', invoiceSchema);

export default Invoice;