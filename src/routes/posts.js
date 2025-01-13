const express = require('express');
const postModel = require('../models/postModel');

const router = express.Router();

router.post('/', postModel.createPost);
router.get('/', postModel.getAllPosts);
router.get('/:id', postModel.getPostById);
router.put('/:id', postModel.updatePost);
router.delete('/:id', postModel.deletePost);

module.exports = router;
