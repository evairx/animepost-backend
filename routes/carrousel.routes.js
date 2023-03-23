const express = require('express');
const CarrouselController = require('../controller/Carrousel');
const router = express.Router();

router.get('/', CarrouselController.getCarrousel);

router.post('/',CarrouselController.addCarrousel);

module.exports = router;