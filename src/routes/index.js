const express = require('express');
const usersRoutes = require('./users');
const postsRoutes = require('./posts');

const router = express.Router();

router.use('/users', usersRoutes);
router.use('/posts', postsRoutes);

module.exports = router;
