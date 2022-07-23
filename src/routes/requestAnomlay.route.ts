import { Router } from 'express';
import requestAnomalyController from '../controllers/requestAnomaly.controller';



const router = Router();

router.post('/', requestAnomalyController.post);

export default router;