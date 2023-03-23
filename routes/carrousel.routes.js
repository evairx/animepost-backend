import express from 'express';
import CarrouselController from '../controller/Carrousel.js';

const router = express.Router();

router.get('/', CarrouselController.getCarrousel);

router.post('/',CarrouselController.addCarrousel);

export default router;