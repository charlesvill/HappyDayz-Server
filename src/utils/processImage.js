// const upload = require('../utils/upload');
const sharp = require('sharp');
const convert = require('heic-convert');

async function convertResizeImage(buffer, fileExt) {
  fileExt = fileExt.toLowerCase();
  const originalSize = buffer.length;

  if (fileExt == 'heic' || fileExt == 'heif') {
    console.log('filesize before conversion ', originalSize, ' bytes');
    buffer = await convert({
      buffer: buffer,
      format: 'JPEG',
      quality: 0.6,
    });
    console.log('filesize after conversion ', buffer.length, ' bytes');
  }
  const webpBuffer = await sharp(buffer)
    .resize({ width: 900, withoutEnlargement: true })
    .webp({ quality: 85 })
    .toBuffer();

  console.log('File size after resizing: ', webpBuffer.length, ' bytes');
  console.log(
    'processed image is ',
    (webpBuffer.length / originalSize) * 100,
    '% of the original size'
  );
  return webpBuffer;
}
module.exports = { convertResizeImage };
