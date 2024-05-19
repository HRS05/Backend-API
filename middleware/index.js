const auth = require('./auth');
const executor = require('./executor');
const accessAllowed = require('./accessAllowed');
const validateInfo = require('./validator');
const imageUpload = require('./multer');


module.exports = {
    auth,
    executor,
    accessAllowed,
    validateInfo,
    imageUpload
}