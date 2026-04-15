const path = require('path');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '..', 'uploads'));
  },
  filename: function (req, file, cb) {
    console.log('orginal file name: ', file.originalname);
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(
      null,
      path.basename(file.originalname, path.extname(file.originalname)) +
        '-' +
        uniqueSuffix +
        path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage: storage });

module.exports = upload;
