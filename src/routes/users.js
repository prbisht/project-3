const express = require('express');
const userModel = require('../models/userModel');

const router = express.Router();

router.post('/', userModel.createUser);
router.get('/', userModel.getAllUsers);
router.get('/:id', userModel.getUserById);
router.put('/:id', userModel.updateUser);
router.delete('/:id', userModel.deleteUser);
router.get('/:id/posts', userModel.getPostsByUser);

module.exports = router;
