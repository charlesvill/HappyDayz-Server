const {
  PutObjectCommand,
  DeleteObjectsCommand,
} = require('@aws-sdk/client-s3');
const s3 = require('../config/s3');

async function uploadFile({ key, buffer, contentType }) {
  const command = new PutObjectCommand({
    bucket: process.env.S3_BUCKET,
    key: key,
    // body: buffer will need to be refactored for streams
    Body: buffer,
    ContentType: contentType,
  });

  await s3.send(command);
  return key;
}

function getFileUrl(key) {
  return `https://${process.enf.S3_BUCKET}.s3.amazonaws.com/${key}`;
}

async function deleteFile(key) {
  await s3.send(
    new DeleteObjectsCommand({
      bucket: process.env.S3_BUCKET,
      key: key,
    })
  );
}

module.exports = { uploadFile, getFileUrl, deleteFile };
