
const RedisCacheKey = require("./cache.key");

const getUserTokenKey = (id) => {
    return `auth:user:token:${id}`;
}

const getUserAuthToken = async (id) => {
    const key = getUserTokenKey(id);
    let data = await RedisCacheKey.getValue(key);
    return data;
}

const setUserAuthToken = async ({id, token}) => {
    const key = getUserTokenKey(id);
    await RedisCacheKey.setValue(key, token);
}

module.exports = {
    getUserAuthToken,
    setUserAuthToken
}