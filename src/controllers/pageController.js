const { getPageById, createPage } = require('../models/page.model');
const { InternalServerError } = require('../utils/err');
// async function userOwnsPage(userId, pageId){
//
//
// }
//
// async function getAllPages(req, res, next) {
//   const userId = req.params.userid;
//   const eventId = req.params.eventid;
//
//
//
// }

// halt with all these because..
// pages has no host_id column, and thus no current way to auth user request w/ page
// however event can pull all pages

async function getPage(req, res, next) {
  const userId = req.params.userid;
  const eventId = req.params.eventid;
  const pageId = req.params.pageid;

  try {
    const page = getPageById(pageId);
    res.status(200).json(page);
  } catch (err) {
    return next(new InternalServerError(err));
  }
}

async function addPage(req, res, next) {
  const userId = req.params.userid;
  const eventId = req.params.eventid;

  const { title, type, slug, order } = req.body;

  try {
    const response = createPage(eventId, { title, type, slug, order });
    res.status(200).json(response);
  } catch (err) {
    return next(new InternalServerError(err));
  }
}

module.exports = { getPage, addPage };
