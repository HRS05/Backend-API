const express = require('express');

const router = express.Router();
const { userRoute } = require('./modules/user/index');
const { allAdminRoutes } = require('./modules/admin/index');
const { chatRoute } = require('./modules/chat/index');
// payment controller
router.use('/user',userRoute);

//all admin routes
router.use('/admin',allAdminRoutes);
router.use('/chat',chatRoute);


module.exports = router;
