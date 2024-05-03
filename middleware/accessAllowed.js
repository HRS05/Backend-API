const _ = require('lodash');

const accessAllowed = (arr) => {
    return (req, res, next) => {
      const type = req.user.type;
      if (!arr.includes(type)) {
        return res.status(401).send("User don't have access.");
      }
      next();
    };
  };

module.exports = accessAllowed;
