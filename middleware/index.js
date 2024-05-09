const auth = require('./auth');
const executor = require('./executor');
const accessAllowed = require('./accessAllowed');
const validateInfo = require('./validator');


module.exports = {
    auth,
    executor,
    accessAllowed,
    validateInfo
}