const express = require('express');
const router = express.Router();
const productsConntroller = require('../../controllers/products/productsController');

const multer = require('multer');
const upload = multer({ dest: 'uploads/' });


router.get('/', productsConntroller.getProductAll);
router.put('/:pro_id', upload.array('file'), productsConntroller.updatePorduct);
router.post('/', upload.array('file'), productsConntroller.createProduct);
router.delete('/:pro_id', productsConntroller.deleteProduct);
module.exports = router;


