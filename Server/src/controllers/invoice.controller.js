import mongoose from 'mongoose';

import Invoice from '../models/invoice.model.js';
import Client from '../models/client.model.js';
import Payment from "../models/payment.model.js";

import {
    DEFAULT_LIMIT,
    DEFAULT_PAGE,
    DEFAULT_SORT,
    MAX_LIMIT,
    PAYMENT_STATUS,
} from '../constants/invoice.constants.js';
import { AppError } from '../utils/appError.js';



// ============================================
// GET DASHBOARD STATISTICS
// ============================================

export const getDashboardStats = async (req, res, next) => {
    try {
        const today = new Date();

        const userId = req.userId;

        // ----------------------------------------
        // BASIC STATS
        // ----------------------------------------

        const [stats] = await Invoice.aggregate([
            {
                $match: {
                    createdBy: new mongoose.Types.ObjectId(userId),
                    isArchived: false,
                },
            },
            {
                $group: {
                    _id: null,

                    totalRevenue: {
                        $sum: '$total',
                    },

                    paid: {
                        $sum: '$amountPaid',
                    },

                    outstanding: {
                        $sum: '$balanceDue',
                    },

                    overdue: {
                        $sum: {
                            $cond: [
                                {
                                    $and: [
                                        { $lt: ['$dueDate', today] },
                                        { $gt: ['$balanceDue', 0] },
                                    ],
                                },
                                '$balanceDue',
                                0,
                            ],
                        },
                    },
                },
            },
        ]);

        // ----------------------------------------
        // INVOICE SUMMARY
        // ----------------------------------------

        const invoiceSummary = await Invoice.aggregate([
            {
                $match: {
                    createdBy: new mongoose.Types.ObjectId(userId),
                    isArchived: false,
                },
            },
            {
                $group: {
                    _id: '$paymentStatus',
                    count: {
                        $sum: 1,
                    },
                },
            },
        ]);

        // ----------------------------------------
        // REVENUE FOR LAST 6 MONTHS
        // ----------------------------------------

        const revenueStartDate = new Date();

        revenueStartDate.setMonth(
            revenueStartDate.getMonth() - 5
        );

        revenueStartDate.setDate(1);
        revenueStartDate.setHours(0, 0, 0, 0);

        const revenueData = await Invoice.aggregate([
            {
                $match: {
                    createdBy: new mongoose.Types.ObjectId(userId),
                    isArchived: false,
                    issueDate: {
                        $gte: revenueStartDate,
                    },
                },
            },
            {
                $group: {
                    _id: {
                        year: {
                            $year: '$issueDate',
                        },
                        month: {
                            $month: '$issueDate',
                        },
                    },

                    amount: {
                        $sum: '$total',
                    },
                },
            },
        ]);

        // ----------------------------------------
        // FORMAT SIX MONTHS
        // ----------------------------------------

        const formattedRevenue = [];

        for (let i = 5; i >= 0; i--) {
            const date = new Date();

            date.setMonth(
                date.getMonth() - i
            );

            const year = date.getFullYear();
            const month = date.getMonth() + 1;

            const existingMonth = revenueData.find(
                (item) =>
                    item._id.year === year &&
                    item._id.month === month
            );

            formattedRevenue.push({
                year,
                month,
                amount: existingMonth
                    ? existingMonth.amount
                    : 0,
            });
        }

        // ----------------------------------------
        // RECENT INVOICES
        // ----------------------------------------

        const recentActivity = await Invoice.find({
            createdBy: userId,
            isArchived: false,
        })
            .populate(
                'client',
                'fullName company'
            )
            .sort({
                createdAt: -1,
            })
            .limit(5)
            .select(
                'invoiceNumber title total amountPaid balanceDue paymentStatus createdAt client'
            );

        // ----------------------------------------
        // FORMAT STATS
        // ----------------------------------------

        const dashboardStats = stats || {
            totalRevenue: 0,
            paid: 0,
            outstanding: 0,
            overdue: 0,
        };

        // ----------------------------------------
        // FORMAT INVOICE SUMMARY
        // ----------------------------------------

        const summary = {
            total: 0,
            paid: 0,
            unpaid: 0,
            partiallyPaid: 0,
        };

        invoiceSummary.forEach((item) => {
            summary.total += item.count;

            if (item._id === PAYMENT_STATUS.PAID) {
                summary.paid = item.count;
            }

            if (item._id === PAYMENT_STATUS.UNPAID) {
                summary.unpaid = item.count;
            }

            if (
                item._id === PAYMENT_STATUS.PARTIALLY_PAID
            ) {
                summary.partiallyPaid = item.count;
            }
        });

        // ----------------------------------------
        // RESPONSE
        // ----------------------------------------

        return res.status(200).json({
            success: true,

            data: {
                stats: dashboardStats,

                revenue: formattedRevenue,

                invoiceSummary: summary,

                recentActivity,
            },
        });
    } catch (error) {
        next(error);
    }
};


// ============================================
// CREATE INVOICE
// ============================================

export const createInvoice = async (req, res, next) => {
    try {
        const {
            client,
            title,
            description,
            dueDate,
            items,
            tax = 0,
            discount = 0,
            currency = 'USD',
            notes,
        } = req.body;

        // Validate required fields
        if (
            !client ||
            !title ||
            !dueDate ||
            !Array.isArray(items) ||
            items.length === 0
        ) {
            throw new AppError(
                'Client, title, due date and at least one invoice item are required.',
                400
            );
        }

        // Validate client ID
        if (!mongoose.Types.ObjectId.isValid(client)) {
            throw new AppError('Invalid client ID.', 400);
        }

        // Check client
        const existingClient = await Client.findById(client);

        if (!existingClient) {
            throw new AppError('Client not found.', 404);
        }

        if (existingClient.isArchived) {
            throw new AppError(
                'Cannot create invoice for an archived client.',
                400
            );
        }

        // Validate tax and discount
        const taxAmount = Number(tax);
        const discountAmount = Number(discount);

        if (Number.isNaN(taxAmount) || taxAmount < 0) {
            throw new AppError('Tax cannot be negative.', 400);
        }

        if (Number.isNaN(discountAmount) || discountAmount < 0) {
            throw new AppError('Discount cannot be negative.', 400);
        }

        // Validate invoice items
        const invoiceItems = items.map((item, index) => {
            const quantity = Number(item.quantity);
            const unitPrice = Number(item.unitPrice);

            if (!item.description?.trim()) {
                throw new AppError(
                    `Item ${index + 1}: Description is required.`,
                    400
                );
            }

            if (Number.isNaN(quantity) || quantity <= 0) {
                throw new AppError(
                    `Item ${index + 1}: Quantity must be greater than zero.`,
                    400
                );
            }

            if (Number.isNaN(unitPrice) || unitPrice < 0) {
                throw new AppError(
                    `Item ${index + 1}: Unit price cannot be negative.`,
                    400
                );
            }

            return {
                description: item.description.trim(),
                quantity,
                unitPrice,
                amount: quantity * unitPrice,
            };
        });

        // Calculate subtotal
        const subTotal = invoiceItems.reduce(
            (sum, item) => sum + item.amount,
            0
        );

        // Calculate total
        const total = subTotal + taxAmount - discountAmount;

        if (total < 0) {
            throw new AppError(
                'Invoice total cannot be negative.',
                400
            );
        }

        // Generate invoice number
        const invoiceNumber = `INV-${Date.now()}`;

        // Create invoice
        const invoice = await Invoice.create({
            client,
            invoiceNumber,
            title: title.trim(),
            description: description?.trim(),
            dueDate,
            items: invoiceItems,
            subTotal,
            tax: taxAmount,
            discount: discountAmount,
            total,
            amountPaid: 0,
            balanceDue: total,
            currency,
            notes: notes?.trim(),
            createdBy: req.userId,
        });

        return res.status(201).json({
            success: true,
            message: 'Invoice created successfully.',
            data: invoice,
        });
    } catch (error) {
        next(error);
    }
};


// ============================================
// GET ALL INVOICES
// ============================================

export const getInvoices = async (req, res, next) => {
    try {
        const {
            page = DEFAULT_PAGE,
            limit = DEFAULT_LIMIT,
            status,
            paymentStatus,
            client,
            archived,
            search,
            sort = DEFAULT_SORT,
        } = req.query;

        const filters = {};

        // Invoice status
        if (status) {
            filters.status = status;
        }

        // Payment status
        if (paymentStatus) {
            filters.paymentStatus = paymentStatus;
        }

        // Client
        if (client) {
            if (!mongoose.Types.ObjectId.isValid(client)) {
                throw new AppError('Invalid client ID.', 400);
            }

            filters.client = client;
        }

        // Archived
        if (archived !== undefined) {
            filters.isArchived = archived === 'true';
        } else {
            filters.isArchived = false;
        }

        // Search
        if (search?.trim()) {
            filters.$or = [
                {
                    title: {
                        $regex: search.trim(),
                        $options: 'i',
                    },
                },
                {
                    invoiceNumber: {
                        $regex: search.trim(),
                        $options: 'i',
                    },
                },
            ];
        }

        // Pagination
        const pageNumber = Math.max(Number(page) || 1, 1);
        const limitNumber = Math.min(
            Math.max(Number(limit) || DEFAULT_LIMIT, 1),
            MAX_LIMIT
        );

        const skip = (pageNumber - 1) * limitNumber;

        const invoices = await Invoice.find(filters)
            .populate(
                'client',
                'fullName email company phone billingAddress'
            )
            .sort(sort)
            .skip(skip)
            .limit(limitNumber);

        const totalInvoices = await Invoice.countDocuments(filters);

        return res.status(200).json({
            success: true,
            data: invoices,
            pagination: {
                total: totalInvoices,
                page: pageNumber,
                limit: limitNumber,
                totalPages: Math.ceil(
                    totalInvoices / limitNumber
                ),
            },
        });
    } catch (error) {
        next(error);
    }
};


// ============================================
// GET SINGLE INVOICE
// ============================================

export const getInvoice = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new AppError('Invalid invoice ID.', 400);
        }

        const invoice = await Invoice.findById(id).populate(
            'client',
            'fullName email company phone billingAddress'
        );

        if (!invoice) {
            throw new AppError('Invoice not found.', 404);
        }

        return res.status(200).json({
            success: true,
            data: invoice,
        });
    } catch (error) {
        next(error);
    }
};


// ============================================
// UPDATE INVOICE
// ============================================

export const updateInvoice = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new AppError('Invalid invoice ID.', 400);
        }

        const invoice = await Invoice.findById(id);

        if (!invoice) {
            throw new AppError('Invoice not found.', 404);
        }

        const {
            client,
            title,
            description,
            dueDate,
            items,
            tax,
            discount,
            notes,
            currency,
            status,
        } = req.body;

        // ----------------------------------------
        // Validate client
        // ----------------------------------------

        if (client !== undefined) {
            if (!mongoose.Types.ObjectId.isValid(client)) {
                throw new AppError('Invalid client ID.', 400);
            }

            const existingClient = await Client.findById(client);

            if (!existingClient) {
                throw new AppError('Client not found.', 404);
            }

            if (existingClient.isArchived) {
                throw new AppError(
                    'Cannot assign an archived client.',
                    400
                );
            }

            invoice.client = client;
        }

        // ----------------------------------------
        // Update basic fields
        // ----------------------------------------

        if (title !== undefined) {
            if (!title.trim()) {
                throw new AppError(
                    'Invoice title cannot be empty.',
                    400
                );
            }

            invoice.title = title.trim();
        }

        if (description !== undefined) {
            invoice.description = description?.trim();
        }

        if (dueDate !== undefined) {
            invoice.dueDate = dueDate;
        }

        if (notes !== undefined) {
            invoice.notes = notes?.trim();
        }

        if (currency !== undefined) {
            invoice.currency = currency;
        }

        if (status !== undefined) {
            invoice.status = status;
        }

        // ----------------------------------------
        // Update items
        // ----------------------------------------

        if (items !== undefined) {
            if (!Array.isArray(items) || items.length === 0) {
                throw new AppError(
                    'Invoice must contain at least one item.',
                    400
                );
            }

            const updatedItems = items.map((item, index) => {
                const quantity = Number(item.quantity);
                const unitPrice = Number(item.unitPrice);

                if (!item.description?.trim()) {
                    throw new AppError(
                        `Item ${index + 1}: Description is required.`,
                        400
                    );
                }

                if (Number.isNaN(quantity) || quantity <= 0) {
                    throw new AppError(
                        `Item ${index + 1}: Quantity must be greater than zero.`,
                        400
                    );
                }

                if (Number.isNaN(unitPrice) || unitPrice < 0) {
                    throw new AppError(
                        `Item ${index + 1}: Unit price cannot be negative.`,
                        400
                    );
                }

                return {
                    description: item.description.trim(),
                    quantity,
                    unitPrice,
                    amount: quantity * unitPrice,
                };
            });

            invoice.items = updatedItems;

            invoice.subTotal = updatedItems.reduce(
                (sum, item) => sum + item.amount,
                0
            );
        }

        // ----------------------------------------
        // Update tax and discount
        // ----------------------------------------

        if (tax !== undefined) {
            const taxAmount = Number(tax);

            if (Number.isNaN(taxAmount) || taxAmount < 0) {
                throw new AppError(
                    'Tax cannot be negative.',
                    400
                );
            }

            invoice.tax = taxAmount;
        }

        if (discount !== undefined) {
            const discountAmount = Number(discount);

            if (
                Number.isNaN(discountAmount) ||
                discountAmount < 0
            ) {
                throw new AppError(
                    'Discount cannot be negative.',
                    400
                );
            }

            invoice.discount = discountAmount;
        }

        // ----------------------------------------
        // Recalculate total
        // ----------------------------------------

        invoice.total =
            invoice.subTotal +
            invoice.tax -
            invoice.discount;

        if (invoice.total < 0) {
            throw new AppError(
                'Invoice total cannot be negative.',
                400
            );
        }

        // ----------------------------------------
        // Prevent reducing total below amount paid
        // ----------------------------------------

        if (invoice.total < invoice.amountPaid) {
            throw new AppError(
                'Invoice total cannot be less than the amount already paid.',
                400
            );
        }

        await invoice.save();

        return res.status(200).json({
            success: true,
            message: 'Invoice updated successfully.',
            data: invoice,
        });
    } catch (error) {
        next(error);
    }
};


// ============================================
// ARCHIVE INVOICE
// ============================================

export const archiveInvoice = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new AppError('Invalid invoice ID.', 400);
        }

        const invoice = await Invoice.findById(id);

        if (!invoice) {
            throw new AppError('Invoice not found.', 404);
        }

        if (invoice.isArchived) {
            throw new AppError(
                'Invoice is already archived.',
                400
            );
        }

        invoice.isArchived = true;

        await invoice.save();

        return res.status(200).json({
            success: true,
            message: 'Invoice archived successfully.',
            data: invoice,
        });
    } catch (error) {
        next(error);
    }
};


// ============================================
// RESTORE INVOICE
// ============================================

export const restoreInvoice = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new AppError('Invalid invoice ID.', 400);
        }

        const invoice = await Invoice.findById(id);

        if (!invoice) {
            throw new AppError('Invoice not found.', 404);
        }

        if (!invoice.isArchived) {
            throw new AppError(
                'Invoice is not archived.',
                400
            );
        }

        invoice.isArchived = false;

        await invoice.save();

        return res.status(200).json({
            success: true,
            message: 'Invoice restored successfully.',
            data: invoice,
        });
    } catch (error) {
        next(error);
    }
};

export const recordPayment = async (req, res, next) => {
    try {
        const {
            amount,
            paymentMethod,
            reference,
            notes,
            paymentDate,
        } = req.body;

        if (amount === undefined || amount === null) {
            throw new AppError(
                "Payment amount is required.",
                400
            );
        }

        const paymentAmount = Number(amount);

        if (
            !Number.isFinite(paymentAmount) ||
            paymentAmount <= 0
        ) {
            throw new AppError(
                "Payment amount must be greater than zero.",
                400
            );
        }

        const invoice = await Invoice.findOne({
            _id: req.params.id,
            isArchived: false,
        });

        if (!invoice) {
            throw new AppError(
                "Invoice not found.",
                404
            );
        }

        if (paymentAmount > invoice.balanceDue) {
            throw new AppError(
                "Payment amount cannot exceed the outstanding balance.",
                400
            );
        }

        // Create payment record
        const payment = await Payment.create({
            invoice: invoice._id,
            client: invoice.client,
            amount: paymentAmount,
            paymentDate: paymentDate || new Date(),
            paymentMethod,
            reference,
            notes,
            createdBy: req.userId,
        });

        // Update invoice
        invoice.amountPaid += paymentAmount;
        invoice.balanceDue =
            invoice.total - invoice.amountPaid;
        invoice.lastPaymentDate =
            payment.paymentDate;

        await invoice.save();

        return res.status(201).json({
            success: true,
            message: "Payment recorded successfully.",
            data: {
                payment,
                invoice,
            },
        });
    } catch (error) {
        next(error);
    }
};

