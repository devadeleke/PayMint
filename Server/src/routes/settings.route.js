import { Router } from "express";
import {
  getSettings,
  updateSettings,
} from "../controllers/settings.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(protectRoute)

router.get("/", getSettings);

router.put("/", updateSettings);

export default router;