const express = require('express');

const router = express.Router();
const { adminRoute } = require('./user/index');
// payment controller
router.use('/user',adminRoute);

module.exports = router;
