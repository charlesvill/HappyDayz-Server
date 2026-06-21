const { Router } = require('express');
const {
  processImage,
  addModule,
  getAllByPage,
  deleteModule,
} = require('../controllers/moduleController');
const upload = require('../utils/upload');

const moduleRouter = Router();

// proposed routing: /eventid/:pageid/photo

moduleRouter.post(
  '/photo/:eventid/:pageid',
  upload.array('files[]', 5),
  (req, res, next) => {
    console.log(req.files);
    next();
  },
  processImage,
  addModule
);

moduleRouter.get('/photo/:eventid/:pageid', getAllByPage);

moduleRouter.delete('/photo/:eventid/:pageid/:moduleid', deleteModule);

module.exports = moduleRouter;
