import mongoose from 'mongoose';
import { DEFAULT_LIMIT, DEFAULT_PAGE, DEFAULT_SORT, MAX_LIMIT, PAYMENT_STATUS } from '../constants/invoice.constants.js';
import Invoice from '../models/invoice.model.js';
import Client from '../models/client.model.js';
import { AppError } from '../utils/appError.js';

export const getDashboardStats = async (req, res, next) => {
  try {
    const today = new Date();
    const [stats] = await Invoice.aggregate([
      {
        $match: {isArchived: false},
        $group: {
          _id: null,
          totalRevenue: {$sum: "$total"},
          paid: {
            $sum: { $cond: [
              {$eq: [
                "$paymentStatus",
                PAYMENT_STATUS.PAID
              ],
            },
            "$amountPaid",
            0,
            ]}
          }, // paid

          outstanding: {
            $sum: {
              $cond: [
                {
                  $in: [
                    "$paymentStatus",
                    [
                      PAYMENT_STATUS.UNPAID,
                      PAYMENT_STATUS.PARTIAL
                    ],
                  ],
                },
                "$balanceDue",
                0,
              ],
            },
          }, // outstanding

          overdue: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $lt: ["$dueDate", today] },
                    { $ne: ["$balanceDue", PAYMENT_STATUS.PAID] }
                  ]
                },
                "$balanceDue",
                0
              ]
            }
          },

        }// group end
      }
    ])

    res.status(200).json({
      success: true,
      data: stats || {
          totalRevenue: 0,
          paid: 0,
          outstanding: 0,
          overdue: 0,u
      },
    });
  } catch (error) {
    next(error)
  }
}

export const createInvoice = async (req, res, next) => {
  try {
    // GET REQUEST DATA
    const { client, title, description, dueDate, items, tax = 0, discount = 0, currency = "USD", notes } = req.body;
    
    // VALIDATE REQUIRED FIELDS
    if (!client || !title || !dueDate || !Array.isArray(items) || items.length === 0) {
      throw new AppError("Client, title, due date and at least one invoice item are required.", 400)
    };

    // VALIDATE OBJECTID
    if (!mongoose.Types.ObjectId.isValid(client)) {
      throw new AppError("Invalid client ID.", 400)
    };

    // CHECK CLIENT 
    const existingClient = await Client.findById(client);
    if (!existingClient) {
      throw new AppError("Client not found.", 404)
    };

    if (existingClient.isArchived) {
      throw new AppError("Cannot create invoice for an archived client.", 400)
    };

    // VALIDATE INVOICE ITEMS
    const invoiceItems = items.map((item, index) => {
      if (!item.description?.trim()) {
        throw new AppError(`Item ${index + 1}: Description is required.`, 400)
      };

      if (!item.quantity || item.quantity <= 0) {
        throw new AppError(`Item ${index + 1}: Quantity must be greater than zero.`, 400)
      };

      if (item.unitPrice < 0) {
        throw new AppError(`Item ${index + 1}: Unit price cannot be negative.`, 400);
      }

      return {
          description: item.description.trim(),
          quantity: Number(item.quantity),
          unitPrice: Number(item.unitPrice),
          amount: Number(item.quantity) * Number(item.unitPrice),
      };

    });

    // CALCULATE SUBTOTAL
    const subTotal = invoiceItems.reduce(
      (sum, item) => sum + item.amount, 
      0
    );

    // CALCULATE TOTAL
    const total = subTotal + Number(tax) - Number(discount);
    if(total < 0) {
      throw new AppError("Invoice total can not be negative", 400)
    };

    // GENERATE INVOICE NUMBER
    const invoiceNumber = `INV-${Date.now()}`;

    const invoice = await Invoice.create({
      client,
      invoiceNumber,
      title: title.trim(),
      description: description?.trim(),
      dueDate,
      items: invoiceItems,
      subTotal,
      tax: Number(tax),
      discount: Number(discount),
      total,
      amountPaid: 0,
      balanceDue: total,
      currency,
      notes,
      createdBy: req.user._id
    });

    return res.status(201).json({
      success: true,
      message: "Invoice created successfully",
      data: invoice
    })

  } catch (error) {
    next(error)
  }
};

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

        // Status filter
        if (status) {
            filters.status = status;
        }

        // Payment status filter
        if (paymentStatus) {
            filters.paymentStatus = paymentStatus;
        }

        // Client filter
        if (client) {
            filters.client = client;
        }

        // Archived filter
        if (archived !== undefined) {
            filters.isArchived = archived === 'true';
        } else {
            filters.isArchived = false;
        }

        // Search
        if (search) {
            filters.$or = [
                {
                title: {
                    $regex: search,
                    $options: 'i',
                },
                },
                {
                invoiceNumber: {
                    $regex: search,
                    $options: 'i',
                },
                },
            ];
        };

        const pageNumber = Number(page);
        const limitNumber = Math.min(Number(limit), MAX_LIMIT);

        const skip = (pageNumber - 1) * limitNumber;

        const invoices = await Invoice.find(filters)
        .populate('client', 'name email company')
        .sort(sort)
        .skip(skip)
        .limit(limitNumber);

        const totalInvoices = await Invoice.countDocuments(filters);

        res.status(200).json({
            success: true,
            data: invoices,

            pagination: {
                total: totalInvoices,
                page: pageNumber,
                limit: limitNumber,
                totalPages: Math.ceil(totalInvoices / limitNumber),
            },
        });

    } catch (error) {
        next(error)
    }
};

export const getInvoice = async (req, res, next) => {
    try {
        const {id} = req.params;

        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid invoice ID.',
            });
        };
        const invoice = await Invoice.findById(id).populate('client', 'name email company phone address');

        return res.status(200).json({
            success: true,
            data: invoice,
        });
        
    } catch (error) {
        next(error)
    }
};

export const updateInvoice = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid invoice ID.',
      });
    }

    const invoice = await Invoice.findById(id);

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: 'Invoice not found.',
      });
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
      paymentStatus,
    } = req.body;

    // Validate client if changed
    if (client) {
      const existingClient = await Client.findById(client);

      if (!existingClient) {
        return res.status(404).json({
          success: false,
          message: 'Client not found.',
        });
      }

      if (existingClient.isArchived) {
        return res.status(400).json({
          success: false,
          message: 'Cannot assign an archived client.',
        });
      }

      invoice.client = client;
    }

    // Update simple fields
    if (title !== undefined) invoice.title = title;
    if (description !== undefined) invoice.description = description;
    if (dueDate !== undefined) invoice.dueDate = dueDate;
    if (notes !== undefined) invoice.notes = notes;
    if (currency !== undefined) invoice.currency = currency;
    if (status !== undefined) invoice.status = status;
    if (paymentStatus !== undefined) invoice.paymentStatus = paymentStatus;

    // Update items and totals
    if (items) {
      const updatedItems = items.map((item) => ({
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        amount: item.quantity * item.unitPrice,
      }));

      const subTotal = updatedItems.reduce(
        (sum, item) => sum + item.amount,
        0
      );

      invoice.items = updatedItems;
      invoice.subTotal = subTotal;
      invoice.tax = tax ?? invoice.tax;
      invoice.discount = discount ?? invoice.discount;
      invoice.total =
        invoice.subTotal + invoice.tax - invoice.discount;
    } else {
      if (tax !== undefined) invoice.tax = tax;
      if (discount !== undefined) invoice.discount = discount;

      invoice.total =
        invoice.subTotal + invoice.tax - invoice.discount;
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

export const archiveInvoice = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid invoice ID.',
      });
    }

    const invoice = await Invoice.findById(id);

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: 'Invoice not found.',
      });
    }

    if (invoice.isArchived) {
      return res.status(400).json({
        success: false,
        message: 'Invoice is already archived.',
      });
    }

    invoice.isArchived = true;

    await invoice.save();

    return res.status(200).json({
      success: true,
      message: 'Invoice archived successfully.',
      data: invoice,
    });
  } catch (error) {
    next(error)
  }
};

export const restoreInvoice = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid invoice ID.',
      });
    }

    const invoice = await Invoice.findById(id);

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: 'Invoice not found.',
      });
    }

    if (!invoice.isArchived) {
      return res.status(400).json({
        success: false,
        message: 'Invoice is not archived.',
      });
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