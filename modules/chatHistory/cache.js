
const { RedisCacheKey } = require("../../connection/redis");
const { isUndefinedOrNull } = require("../../utils/validators");
const userDetailsModel = require("../chat/model");

const getUnreadCacheKey = ({senderId, reciverId}) => {
    return `chat:unread:Counter:${senderId}:${reciverId}`;
}

const increamentUnreadCount = async ({senderId, reciverId}) => {
    const key = getUnreadCacheKey({senderId, reciverId});
    let data = await RedisCacheKey.getValue(key);
    if (isUndefinedOrNull(data)) {
        await RedisCacheKey.setValue(key, 0);
    } else {
        await RedisCacheKey.setValue(key, data++);
    }
}

const decrementUnreadCount = async ({senderId, reciverId}) => {
    const key = getUnreadCacheKey({senderId, reciverId});
    let data = await RedisCacheKey.getValue(key);
    if (isUndefinedOrNull(data)) {
        await RedisCacheKey.setValue(key, 0);
    } else {
        if (data - 1 >= 0)
            await RedisCacheKey.setValue(key, data--);
    }
}

const markUnreadCountZero = async ({senderId, reciverId}) => {
    const key = getUnreadCacheKey({senderId, reciverId});
    await RedisCacheKey.setValue(key, 0);
}

const getUnreadCount = async ({senderId, reciverId}) => {
    const key = getUnreadCacheKey({senderId, reciverId});
    let data = await RedisCacheKey.getValue(key);
    if (isUndefinedOrNull(data)) {
        return 0;
    }
    return data;
}

module.exports = {
    decrementUnreadCount,
    increamentUnreadCount,
    getUnreadCount,
    markUnreadCountZero
}