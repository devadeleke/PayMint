import { Router } from 'express';

import { getClients, getClient, createClient, updateClient, archiveClient, restoreClient } from '../controllers/client.controller.js';

const router = Router();

router.post('/', createClient);
router.get('/', getClients);
router.get('/:id', getClient);
router.patch('/:id', updateClient);
router.delete('/:id', archiveClient);
router.patch('/:id/restore', restoreClient)

export default router;