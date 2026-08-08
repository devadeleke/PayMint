import { Router } from 'express';

import { getClients, getClient, createClient, updateClient, archiveClient, restoreClient } from '../controllers/client.controller.js';
import { protectRoute } from '../middlewares/auth.middleware.js';

const router = Router();

// Protect all routes below
router.use(protectRoute);

router.post('/', createClient);
router.get('/', getClients);
router.get('/:id', getClient);
router.patch('/:id', updateClient);
router.patch('/:id/archive', archiveClient);
router.patch('/:id/restore', restoreClient)

export default router;