import { Router } from "express";

import {
  getSettings,
  updateSettings,
} from "../controllers/settings.controller.js";

import { protectRoute } from "../middlewares/auth.middleware.js";
import upload from "../middlewares/upload.middleware.js";

const router = Router();

router.use(protectRoute);

router.get("/", getSettings);

router.put(
  "/",
  upload.single("logo"),
  updateSettings
);

export default router;