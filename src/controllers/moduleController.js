const { getModulebyId, createModule } = require('../models/module.model');

async function uploadPhoto(req, res, next){
  // call multer utility fns
  //
}
async function addModule(req, res, next) {
  // const userId = req.params.userid; // guests uploading will not have userid
  const eventId = req.params.eventid;
  const pageId = req.params.pageid;
}

module.exports = { addModule };
