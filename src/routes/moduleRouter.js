const { Router } = require('express');
const { processImage, addModule } = require('../controllers/moduleController');
const upload = require('../utils/upload');

const moduleRouter = Router();

// proposed routing: /eventid/:pageid/photo

moduleRouter.post(
  '/photo/:eventid/:pageid',
  upload.single('file'),
  processImage,
  addModule
);

module.exports = moduleRouter;
