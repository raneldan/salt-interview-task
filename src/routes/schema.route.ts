import { Router } from 'express';
import schemaController from '../controllers/schema.controller';



const router = Router();

router.post('/', schemaController.post);

export default router;