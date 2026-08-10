import Settings from "../models/settings.model.js";
import { AppError } from "../utils/appError.js";

// GET BUSINESS SETTINGS
export const getSettings = async (req, res, next) => {
  try {
    const userId = req.userId;

    let settings = await Settings.findOne({ userId });

    // Create default settings if none exist
    if (!settings) {
      settings = await Settings.create({
        userId,
      });
    }

    res.status(200).json({
      success: true,
      settings,
    });
  } catch (error) {
    next(error);
  }
};


// UPDATE BUSINESS SETTINGS
export const updateSettings = async (req, res, next) => {
  try {
    const userId = req.userId;

    const {
      businessName,
      email,
      phone,
      address,
      city,
      country,
      postalCode,
      website,
      taxId,
    } = req.body;

    const settings = await Settings.findOneAndUpdate(
      { userId },
      {
        businessName,
        email,
        phone,
        address,
        city,
        country,
        postalCode,
        website,
        taxId,
      },
      {
        returnDocument: "after",
        runValidators: true,
        upsert: true,
      }
    );

    res.status(200).json({
      success: true,
      message: "Business information updated successfully",
      settings,
    });
  } catch (error) {
    next(error);
  }
};