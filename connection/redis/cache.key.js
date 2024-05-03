//const { Logger } = require('../../libs/logger');
const { RedisClient } = require('./common');

class ApplicationRedisCache {

    static async getValue(key) {
        return new Promise((resv, rej) => {
            RedisClient.get(key, (err, reply) => {
                if (err) rej(err);
                resv(reply);
            });
        });
    }

    static async setValue(key, value) {
        await RedisClient.set(key, value);
    }

    static async setValueForTime(key, value, time = (60 * 1000)) {
        await RedisClient.set(key, value, 'EX', time);
    }

    static async deleteKey(key) {
        return new Promise((resolve, reject) => {
            RedisClient.del(key, (err, reply) => {
                if (err) reject(err);
                resolve(reply === 1);
            });
        });
    }
}

module.exports = ApplicationRedisCache;
