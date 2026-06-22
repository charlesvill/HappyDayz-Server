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
  upload.array('files[]', 5)(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(413).json({
          message: 'Each file must be smaller than 10 MB.',
        });
      }
    }

    if (err) {
      return next(err);
    }

    next();
  }),
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
