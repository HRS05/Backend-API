const express = require('express');

const router = express.Router();
const { userRoute } = require('./modules/user/index');
// payment controller
router.use('/user',userRoute);

module.exports = router;
