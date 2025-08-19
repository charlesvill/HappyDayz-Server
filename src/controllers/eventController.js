// events
const {
  createEvent,
  readEventById,
  updateEventRow,
} = require('../models/event.model');
const { InternalServerError, NotFoundError } = require('../utils/err');
// create
async function addEvent(req, res, next) {
  const { name, description, startDate, endDate, location } = req.body;
  const userId = req.params.userid;

  try {
    const response = await createEvent(
      userId,
      name,
      description,
      startDate,
      endDate,
      location
    );

    res.json(response);
  } catch (err) {
    return next(new InternalServerError(err));
  }
}

// read
async function getEventById(req, res, next) {
  const eventId = req.params.eventid;
  const userId = req.query.userid;

  if (!userId) {
    return next(new NotFoundError('Not found! requires userid'));
  }
  try {
    const response = await readEventById(userId, eventId);
    if (response.length === 0 || !response) {
      return next(new NotFoundError('could not find event for that user'));
    }
    res.status(200).json(response);
  } catch (err) {
    return next(new InternalServerError(err));
  }
}
// update
async function updateEvent(req, res, next) {
  const { name, description, startDate, endDate, location } = req.body;
  const userId = req.params.userid;

  try {
    const response = await updateEventRow(
      userId,
      name,
      description,
      startDate,
      endDate,
      location
    );

    res.json(response);
  } catch (err) {
    return next(new InternalServerError(err));
  }
}
// delete

module.exports = { addEvent, getEventById, updateEvent };
