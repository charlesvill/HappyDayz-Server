const path = require('path');
const { getModulebyId, createModule } = require('../models/module.model');
const { InternalServerError } = require('../utils/err');

async function addModule(req, res, next) {
  // const userId = req.params.userid; // guests uploading will not have userid
  // const eventId = req.params.eventid;
  const pageId = req.params.pageid;
  // multer adds .file to req if failed,
  if (!req.file) {
    return res.status(400).json({ message: 'no file found!' });
  }

  // module fields needed:
  // type:img
  // data object:
  // title
  // extension
  // size
  // alt text
  // path

  const fileExt = path.extname(req.file.originalname).slice(1);

  const moduleData = {
    title: 'filename',
    extension: fileExt,
    size: req.file.size,
    alt: 'Event photo',
    path: req.file.path,
  };

  // record picture as module in db

  try {
    const response = createModule(pageId, moduleData);
    res.status(200).json(response);
  } catch (err) {
    return next(new InternalServerError(err));
  }
}

module.exports = { addModule };
