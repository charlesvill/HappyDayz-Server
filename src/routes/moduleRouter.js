const { Router } = require('express');
const { addModule } = require('../controllers/moduleController');
const upload = require('../utils/upload');

const moduleRouter = Router();

// proposed routing: /eventid/:pageid/photo
moduleRouter.post('/photo', upload.single('file'), addModule);

module.exports = moduleRouter;
