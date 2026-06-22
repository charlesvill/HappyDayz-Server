const {
  PutObjectCommand,
  DeleteObjectsCommand,
  GetObjectCommand,
} = require('@aws-sdk/client-s3');
const s3 = require('../config/s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

async function uploadFile({ key, buffer, contentType }) {
  const command = new PutObjectCommand({
    Bucket: process.env.S3_BUCKET,
    Key: key,
    Body: buffer,
    ContentType: contentType,
  });

  await s3.send(command);
  return key;
}

async function getFileUrl(key) {
  const command = new GetObjectCommand({
    Bucket: process.env.S3_BUCKET,
    Key: key,
  });
  return await getSignedUrl(s3, command, {
    expiresIn: 60 * 60,
  });
}

async function deleteFile(key) {
  await s3.send(
    new DeleteObjectsCommand({
      Bucket: process.env.S3_BUCKET,
      Delete: {
        Objects: [{ Key: key }],
      },
    })
  );
}

module.exports = { uploadFile, getFileUrl, deleteFile };
