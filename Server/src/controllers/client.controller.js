import mongoose from "mongoose";
import { AppError } from '../utils/appError.js';
import { logger } from '../config/logger.js';
import Client from '../models/client.model.js';

export const createClient = async (req, res, next) => {
    const { fullName, email, company, phone, billingAddress, notes } = req.body;

        try {
            if (!fullName || !email) {
                throw new AppError('Client name and email are required', 400);
            };

            const existingClient = await Client.findOne({
                email
            });

            if (existingClient) {
                throw new AppError(`You already have a client with email "${email}"`, 409);
            }

             const client = await Client.create({
                userId: req.userId,
                fullName: fullName,
                email: email,
                company: company || '',
                phone: phone || '',
                billingAddress: billingAddress || {},
                notes: notes || '',
            });

            return res.status(201).json({
                status: 'success',
                data: { client }
            });
        } catch (error) {
            next(error)
        }
};

export const getClients = async (req, res, next) => {
    try {
        const { search, page = 1, limit = 10} = req.query;

        const query = { isArchived: false };

        if (search) {
            query.fullName = {
                $regex: search,
                $options: "i"
            };
        };

        const clients = await Client.find(query)
                        .skip((page - 1) * limit)
                        .limit(Number(limit));
        
        res.json({
            success: true,
            data: clients,
        });
    } catch (error) {
        next(error);
    }
};

export const getClient = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid client ID",
            });
        }

        const client = await Client.findOne({
            _id: id,
            userId: req.userId,
            isArchived: false,
        });

        console.log("Client:", client);
        console.log("Logged-in User:", req.userId);

        if (!client) {
            return res.status(404).json({
                success: false,
                message: "Client not found",
            });
        }

        return res.status(200).json({
            success: true,
            data: client
        });
    } catch (error) {
        next(error);
    }
};

export const updateClient = async (req, res, next) => {
    try {
        const client = await Client.findOneAndUpdate(
            {
                _id: req.params.id,
                isArchived: false
            },
            req.body,
            {
                returnDocument: 'after',
            }
        );

        if (!client) {
            return res.status(404).json({
                success: false,
                message: "Client not found",
            });
        }

        logger.info(`Client "${client.fullName}" updated`);

        res.json({
            success: true,
            data: client,
        });
    } catch (error) {
        next(error)
    }
};

export const archiveClient = async (req, res, next) => {
  try {
    const client = await Client.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.userId,
      },
      {
        $set: {
          isArchived: true,
          archivedAt: new Date(),
        },
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!client) {
      return res.status(404).json({
        success: false,
        message: "Client not found",
      });
    }

    logger.info(`Client "${client.fullName}" archived`);

    return res.status(200).json({
      success: true,
      message: "Client archived successfully",
      data: client,
    });
  } catch (error) {
    next(error);
  }
};

export const restoreClient = async (req, res, next) => {
  try {
    const client = await Client.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.user._id,
      },
      {
        isArchived: false,
      },
      {
        new: true,
      }
    );

    if (!client) {
      return res.status(404).json({
        success: false,
        message: "Client not found",
      });
    }

    logger.info(`Client "${client.fullName}" restored`);

    res.status(200).json({
      success: true,
      message: "Client restored successfully",
      data: client,
    });
  } catch (error) {
    next(error);
  }
};