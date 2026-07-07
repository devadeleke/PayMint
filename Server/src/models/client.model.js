import mongoose from 'mongoose';

const clientSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            immutable: true, // Once set, can never be changed (prevents data theft)
        },

        fullName: { 
            type: String, 
            required: true,
            trim: true
        },
        email: {
            type: String,
            unique: true,
            required: true,
            trim: true
        },

        company: {
            type: String,
            maxlength: 200
        },

        phone: {
            type: String,
            trim: true,
            maxlength: 20
        },

        billingAddress: {
            street: {
                type: String,
                trim: true,
                default: '',
            },
            city: {
                type: String,
                trim: true,
                default: '',
            },
            state: {
                type: String,
                trim: true,
                default: '',
            },
            zipCode: {
                type: String,
                trim: true,
                default: '',
            },
            country: {
                type: String,
                trim: true,
                default: '',
            },
        },

        notes: {
            type: String,
            trim: true,
            maxlength: [1000, 'Notes cannot exceed 1000 characters'],
            default: '',
        },
        totalInvoiced: {
            type: Number,
            default: 0,
            min: 0,
        },

            totalPaid: {
            type: Number,
            default: 0,
            min: 0,
        },

        invoiceCount: {
            type: Number,
            default: 0,
            min: 0,
        },

        // Track the last invoice date for sorting/filtering
        lastInvoiceDate: {
            type: Date,
            default: null,
        },

        // ============================================
        // SOFT DELETE
        // ============================================
        // Why separate isArchived + archivedAt instead of just deletedAt?
        // 1. Boolean queries are faster than null checks
        // 2. We can query "show me only active" with a simple { isArchived: false }
        // 3. archivedAt preserves when it happened for audit trails
        isArchived: {
            type: Boolean,
            default: false,
        },

        archivedAt: {
            type: Date,
            default: null,
        },
    },

    { timestamps: true}
);

const Client = mongoose.model('Client', clientSchema);
export default Client;