const path = require('path');
const fs = require('fs/promises');
const { createModule } = require('../models/module.model');
const { InternalServerError } = require('../utils/err');
const { convertResizeImage } = require('../utils/processImage');

async function processImage(req, res, next) {
  const fileExt = path.extname(req.file.originalname).slice(1).toLowerCase();
  console.log('File type: ', fileExt);

  try {
    const dirPath = './uploads';
    const webpBuffer = await convertResizeImage(req.file.buffer, fileExt);

    await fs.writeFile(path.join(dirPath, 'converted.webp'), webpBuffer);
  } catch (err) {
    return next(new InternalServerError(err));
  }
  next();
}

async function addModule(req, res, next) {
  // const userId = req.params.userid; // guests uploading will not have userid
  // const eventId = req.params.eventid;
  // console.log('the current request: ',req);
  const pageId = req.params.pageid;

  // multer adds .file to req if failed,
  if (!req.file) {
    return res.status(400).json({ message: 'no file found!' });
  }

  const fileExt = path.extname(req.file.originalname).slice(1);
  const title = path.basename(
    req.file.originalname,
    path.extname(req.file.originalname)
  );

  const moduleData = {
    type: 'image',
    data: {
      title,
      extension: fileExt,
      size: req.file.size,
      alt: 'Event photo',
      path: req.file.path,
    },
  };

  try {
    const response = await createModule(pageId, moduleData);
    return res.status(200).json(response);
  } catch (err) {
    return next(new InternalServerError(err));
  }
}

module.exports = {
  processImage,
  addModule,
};
