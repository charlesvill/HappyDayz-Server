// events
const {
  createEvent,
  readEventById,
  updateEventRow,
  deleteEventById, 
} = require('../models/event.model');
const {
  InternalServerError,
  NotFoundError,
  ForbiddenError,
} = require('../utils/err');

async function userOwnsEvent(userId, eventId) {
  const event = await readEventById(eventId);
  if (!event || event.length === 0) {
    return { status: 404 };
  }
  if (event.host_id !== userId) {
    return { status: 403 };
  }
  return { status: 400, event };
}

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

    res.status(200).json(response);
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
    const response = await userOwnsEvent(userId, eventId);
    if (response.status === 404) {
      return next(new NotFoundError('could not find event'));
    }
    if (response.status === 403) {
      return next(new ForbiddenError('You do not have access to that event'));
    }
    res.status(200).json(response.event);
  } catch (err) {
    return next(new InternalServerError(err));
  }
}

// update
async function updateEvent(req, res, next) {
  const { name, description, startDate, endDate, location } = req.body;
  const userId = req.params.userid;
  const eventId = req.params.eventid;

  try {
    const eventObject = await userOwnsEvent(userId, eventId);
    if (eventObject.status === 400) {
      return next(new NotFoundError('event not found'));
    }
    if (eventObject.status === 403) {
      return next(
        new ForbiddenError('You do not have access to edit this event')
      );
    }
    const response = await updateEventRow(
      userId,
      name,
      description,
      startDate,
      endDate,
      location
    );

    res.status(200).json(response);
  } catch (err) {
    return next(new InternalServerError(err));
  }
}

// delete

async function deleteEvent(req, res, next) {
  const userId = req.params.userid;
  const eventId = req.params.eventid;

  try {
    const eventObject = await userOwnsEvent(userId, eventId);
    if ((eventObject.status = 404)) {
      return next(new NotFoundError('event not found'));
    }
    if (eventObject.status === 403) {
      return next(
        new ForbiddenError('You do not have access to manipulate this event')
      );
    }
    const response = await deleteEventById(eventId);
    res.status(200).json(response);
  } catch (err) {
    return next(new InternalServerError(err));
  }
}
module.exports = { addEvent, getEventById, updateEvent, deleteEvent };
