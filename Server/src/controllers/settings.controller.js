import Settings from "../models/settings.model.js";
import cloudinary from "../config/cloudinary.js";
import { AppError } from "../utils/appError.js";

// GET BUSINESS SETTINGS
export const getSettings = async (req, res, next) => {
  try {
    const userId = req.userId;

    let settings = await Settings.findOne({ userId });

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

    let logoUrl;

    if (req.file) {
      const uploadResult = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: "paymint/business-logos",
            resource_type: "image",
          },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          }
        );

        uploadStream.end(req.file.buffer);
      });

      logoUrl = uploadResult.secure_url;
    }

    const updateData = {
      businessName,
      email,
      phone,
      address,
      city,
      country,
      postalCode,
      website,
      taxId,
    };

    if (logoUrl) {
      updateData.logo = logoUrl;
    }

    const settings = await Settings.findOneAndUpdate(
      { userId },
      updateData,
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