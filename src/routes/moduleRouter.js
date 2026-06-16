const { Router } = require('express');
const { processImage, addModule } = require('../controllers/moduleController');
const upload = require('../utils/upload');

const moduleRouter = Router();

// proposed routing: /eventid/:pageid/photo

moduleRouter.post(
  '/photo/:eventid/:pageid',
  upload.array('files[]', 6),
  (req, res, next) => {
    console.log(req.file);
    console.log(req);

    res.status(200).send('something should happen');
  }
  // processImage,
  // addModule
);

module.exports = moduleRouter;
