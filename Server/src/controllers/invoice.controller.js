import mongoose from 'mongoose';
import { DEFAULT_LIMIT, DEFAULT_PAGE, DEFAULT_SORT, MAX_LIMIT } from '../constants/invoice.constants.js';
import Invoice from '../models/invoice.model.js';
import Client from '../models/client.model.js';
import { AppError } from '../utils/appError.js'

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
        notes,
        currency = 'NGN',
      } = req.body;  

      if (!client || !title || !dueDate || !items?.length) {
        throw new AppError('Client, title, due date and at least one item are required.', 404)
      };

      const existingClient = await Client.findById(client);

      if (!existingClient) {
        throw new AppError('Client not found', 404)
      };

      // Check if client is archived
      if (existingClient.isArchived) {
        throw new AppError('Cannot create invoice for an archived client.', 404)
      };

      // Calculate item amounts
    const invoiceItems = items.map((item) => ({
      description: item.description,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      amount: item.quantity * item.unitPrice,
    }));

    // Calculate subtotal
    const subtotal = invoiceItems.reduce(
      (sum, item) => sum + item.amount,
      0
    );

    // Calculate total
    const total = subtotal + tax - discount;

    // Generate invoice number
    const invoiceNumber = `INV-${Date.now()}`;

    const invoice = await Invoice.create({
      client,
      invoiceNumber,
      title,
      description,
      dueDate,
      items: invoiceItems,
      subtotal,
      tax,
      discount,
      total,
      notes,
      currency,
    });

    return res.status(201).json({
      success: true,
      message: 'Invoice created successfully.',
      data: invoice,
    });

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

      const subtotal = updatedItems.reduce(
        (sum, item) => sum + item.amount,
        0
      );

      invoice.items = updatedItems;
      invoice.subtotal = subtotal;
      invoice.tax = tax ?? invoice.tax;
      invoice.discount = discount ?? invoice.discount;
      invoice.total =
        invoice.subtotal + invoice.tax - invoice.discount;
    } else {
      if (tax !== undefined) invoice.tax = tax;
      if (discount !== undefined) invoice.discount = discount;

      invoice.total =
        invoice.subtotal + invoice.tax - invoice.discount;
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