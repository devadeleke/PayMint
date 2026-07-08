import { Router } from 'express';
import { createInvoice, getInvoices, getInvoice, updateInvoice, archiveInvoice, restoreInvoice } from '../controllers/invoice.controller.js';

const router = Router();

router.post('/', createInvoice);
router.get('/', getInvoices);
router.get('/:id', getInvoice);
router.patch('/:id', updateInvoice);
router.delete('/:id', archiveInvoice);
router.patch('/:id/restore', restoreInvoice);

export default router;