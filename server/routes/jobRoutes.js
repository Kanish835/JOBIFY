import { Router } from 'express';
import { getJobs, getJob, updateJobStatus, updateJob, deleteJob, bulkAction, getJobStats } from '../controllers/jobController.js';

const router = Router();

router.get('/stats/overview', getJobStats);
router.get('/', getJobs);
router.get('/:id', getJob);
router.patch('/:id/status', updateJobStatus);
router.patch('/:id', updateJob);
router.delete('/:id', deleteJob);
router.post('/bulk-action', bulkAction);

export default router;
