const path = require('path');
const fs = require('fs/promises');
const { createModule } = require('../models/module.model');
const { InternalServerError } = require('../utils/err');
const { convertResizeImage } = require('../utils/processImage');

async function processImage(req, res, next) {
  const start = performance.now();
  const dirPath = './uploads';

  const bufferPromises = req.files.map(async (file) => {
    const fileExt = path.extname(file.originalname).slice(1).toLowerCase();
    const filebaseName = path.basename(file.originalname, fileExt);
    console.log('File type: ', fileExt);
    const webpBuffer = await convertResizeImage(file.buffer, fileExt);

    await fs.writeFile(path.join(dirPath, `${filebaseName}.webp`), webpBuffer);
    return webpBuffer;
  });

  try {
    const bufferResults = await Promise.all(bufferPromises);
    console.log(bufferResults, ' here are the results!');
  } catch (err) {
    return next(new InternalServerError(err));
  }
  const end = performance.now();
  const duration = (end - start) / 1000;

  console.log('Image processing took ', duration.toFixed(2), ' seconds');
  next();
  // res.send(200);
}

async function addModule(req, res, next) {
  // const userId = req.params.userid; // guests uploading will not have userid
  // const eventId = req.params.eventid;
  // console.log('the current request: ',req);
  const pageId = req.params.pageid;

  if (!req.files) {
    return res.status(400).json({ message: 'no file(s) found!' });
  }

  const batchDbInsertions = req.files.map(async (file) => {
    const fileExt = path.extname(file.originalname).slice(1);
    const title = path.basename(file.originalname, fileExt);
    console.log(title);

    const moduleData = {
      type: 'image',
      data: {
        title,
        extension: fileExt,
        size: file.size,
        alt: 'Event photo',
        // this will need to be updated when implemented in the cloud
        path: file.path,
      },
    };
    return await createModule(pageId, moduleData);
  });

  try {
    const response = await Promise.all(batchDbInsertions);
    return res.status(200).json(response);
  } catch (err) {
    return next(new InternalServerError(err));
  }
}

module.exports = {
  processImage,
  addModule,
};
