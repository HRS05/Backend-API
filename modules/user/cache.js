
const { RedisCacheKey } = require("../../connection/redis");
const { isUndefinedOrNull } = require("../../utils/validators");
const userDetailsModel = require("./model");

const getUserBasicDetailsKey = (id) => {
    return `basic:user:detials:${id}`;
}

const getUserBasicDetails = async (id) => {
    const key = getUserBasicDetailsKey(id);
    let data = await RedisCacheKey.getValue(key);
    if (!isUndefinedOrNull(data)) return JSON.parse(data);
    data = await userDetailsModel.findById(id);
    if (isUndefinedOrNull(data)) return null;
    const result = {
        id: data._id,
        name: data.name,
        email: data.email,
        profileUrl: data.profileUrl
    }
    await RedisCacheKey.setValue(getUserBasicDetailsKey(id), JSON.stringify(result));
    return result;
}

const deleteUserBasicDetails = async (id) => {
    const key = getUserBasicDetailsKey(id);
    await RedisCacheKey.deleteKey(key);
}


module.exports = {
    getUserBasicDetails,
    deleteUserBasicDetails
}