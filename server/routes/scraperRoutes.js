import { Router } from 'express';
import { startScraping, getScraperStatus } from '../controllers/scraperController.js';

const router = Router();

router.post('/start', startScraping);
router.get('/status', getScraperStatus);

export default router;
