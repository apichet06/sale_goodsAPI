const express = require('express');
const router = express.Router();
const UserController = require('../../controllers/users/UserController');
const auth = require('../../middleware/auth');

const multer = require('multer');
const upload = multer({ dest: 'uploads/' });


router.post('/login', UserController.login);
router.post('/users', auth.authenticateToken, upload.single('file'), UserController.createUser);
router.put('/users/:u_id', auth.authenticateToken, upload.single('file'), UserController.updateUser);
router.delete('/users/:u_id', auth.authenticateToken, UserController.deleteUser);
router.get('/users/', auth.authenticateToken, UserController.UserAll);


module.exports = router;
