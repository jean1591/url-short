import { Router } from 'express';
import { getUrlController } from './get-url.controller';
import { shortenUrlController } from './shorten-url.controller';

const router = Router();

router.post('/', shortenUrlController);
router.get('/:shortCode', getUrlController);

export default router;
