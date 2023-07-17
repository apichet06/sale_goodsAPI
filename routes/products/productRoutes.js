const express = require('express');
const router = express.Router();
const productsConntroller = require('../../controllers/products/productsController');

router.get('/', productsConntroller.getProductAll);


module.exports = router;


