const { Router } = require('express');
const { addModule } = require('../controllers/moduleController');
const upload = require('../utils/upload');

const moduleRouter = Router();

// proposed routing: /eventid/:pageid/photo
moduleRouter.post('/photo/:eventid/:pageid', upload.single('file'),(req, res, next)=>{console.log(req.params)},  addModule);


module.exports = moduleRouter;
