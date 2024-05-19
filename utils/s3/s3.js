const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
require("dotenv").config();

const bucketName = process.env.BUCKET_NAME
const bucketRegion = process.env.BUCKET_REGION
const bucketAccessKey = process.env.BUCKET_ACCESS_KEY
const bucketSecretAccessKey = process.env.BUCKET_SECRET_ACCESS_KEY
const { getName } = require('./details');

const s3 = new S3Client({
    credentials: {
        accessKeyId: bucketAccessKey,
        secretAccessKey: bucketSecretAccessKey
    },
    region: bucketRegion
});

const putObjectToBucket = async ({ data, user, type }) => {
    const keyName =  getName({ user, type });
    const params = {
        Bucket: bucketName,
        Key: keyName,
        Body: data.buffer,
        ContentType: data.mimetype
    }

    const command = new PutObjectCommand(params);
    await s3.send(command);
    return keyName;
}

module.exports = {
    putObjectToBucket
};