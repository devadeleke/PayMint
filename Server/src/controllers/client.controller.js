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
                fullName: fullName,
                email: email,
                company: company || '',
                phone: phone || '',
                billingAddress: billingAddress || {},
                notes: notes || '',
            });

            logger.info(`Client "${client.fullName}" created`);

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
        const client = await Client.findOne({ _id: req.params.id, isArchived: false });
        if (!client) {
            return res.status(404).json({
                success: false,
                message: "Client not found",
            });
        };

        res.json({
            success: true,
            data: client,
        });
    } catch (error) {
        next(error);
    };
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
        const client = await Client.findByIdAndUpdate(
            req.params.id,
            {
                isArchived: true
            },
            {
                returnDocument: 'after'
            }
        );

        if (!client) {
            return res.status(404).json({
                success: false,
                message: "Client not found",
            });
        };

        logger.info(`Client "${client.fullName}" archived`);

        res.json({
            success: true,
            data: client,
        });
    } catch (error) {
        next(error)
    };
};

export const restoreClient = async (req, res, next) => {
  try {
    const client = await Client.findByIdAndUpdate(
      req.params.id,
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
    };

    logger.info(`Client "${client.fullName}" restored`);

    res.json({
      success: true,
      data: client,
    });
  } catch (error) {
    next(error)
  };
};