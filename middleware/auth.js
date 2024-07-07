const jwt = require("jsonwebtoken");
require("dotenv").config();
const config = process.env;
const { RedisAuthTokenCacheKey } = require("../connection/redis");

const verifyToken = async (req, res, next) => {
  const token =
    req?.body.token || req?.query.token || req?.headers["x-auth-token"];
  if (!token) {
    return res.status(403).send("A token is required for authentication");
  }
  try {
    const decoded = jwt.verify(token, process.env.TOKEN_KEY);
    const latestToken = await RedisAuthTokenCacheKey.getUserAuthToken(decoded.user_id);
    if (latestToken !== token) return res.status(401).send("Invalid Token");
    req.user = decoded;
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }
  return next();
};

module.exports = verifyToken;
