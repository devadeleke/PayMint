import { Router } from 'express';
import { createInvoice, getInvoices, getInvoice, updateInvoice, archiveInvoice, restoreInvoice, getDashboardStats, recordPayment } from '../controllers/invoice.controller.js';
import { protectRoute } from '../middlewares/auth.middleware.js';
import {
    getInvoicePayments,
} from "../controllers/payment.controller.js";

const router = Router();

// Protect all routes below
router.use(protectRoute);

// ============================================
// INVOICE DASHBOARD
// ============================================
router.get(
    '/dashboard/stats',
    getDashboardStats
);

router.post('/', createInvoice);
router.get('/', getInvoices);
router.get('/:id', getInvoice);
router.patch('/:id', updateInvoice);
router.patch('/:id/archive', archiveInvoice);
router.patch('/:id/restore', restoreInvoice);
router.patch(
    "/:id/payment",
    protectRoute,
    recordPayment
);

router.get(
    "/:id/payments",
    getInvoicePayments
);
export default router;