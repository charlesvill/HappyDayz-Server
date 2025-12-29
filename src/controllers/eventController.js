// events.controller.js
// this page was modified check inputs and outputs are consistent with usecase applications

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

const eventService = require('../services/eventService');

// Utility: check if user owns event
async function userOwnsEvent(userId, eventId) {
  const event = await readEventById(eventId);

  console.log('event object inside userownsevent', event);
  if (!event) {
    return { status: 404 };
  }
  if (Number(event.host_id) !== Number(userId)) {
    return { status: 403 };
  }
  return { status: 200, event };
}

// CREATE
async function addEvent(req, res, next) {
  const { name, description, startDate, endDate, location, pages } = req.body;
  const userId = req.params.userid;
  console.log('userId here is: ', userId);

  try {
    const body = { name, description, startDate, endDate, location, pages };
    const eventResponse = await eventService(userId, body);
    res.status(200).json(eventResponse);
  } catch (err) {
    return next(new InternalServerError(err));
  }
}

// READ
async function getEventById(req, res, next) {
  const eventId = req.params.eventid;
  const userId = req.params.userid;
  const guestCode = req.query.guest;

  console.log('eventID in get Event: ', eventId);
  console.log('userID in get Event: ', userId);

  if (!userId) {
    return next(new NotFoundError('Not found! requires userid'));
  }

  if (!eventId) {
    return next(new NotFoundError('Not found! missing eventId'));
  }

  try {
    const response = await userOwnsEvent(userId, eventId);

    if (response.status === 404) {
      return next(new NotFoundError('could not find event'));
    }

    // If guestCode is provided, you can later handle guest logic here
    if (guestCode && response.status === 403) {
      return next(new ForbiddenError('You do not have access to that event'));
    }

    res.status(200).json(response.event);
  } catch (err) {
    return next(new InternalServerError(err));
  }
}

// UPDATE
async function updateEvent(req, res, next) {
  const { name, description, startDate, endDate, location } = req.body;
  const userId = req.params.userid;
  const eventId = req.params.eventid;

  try {
    const eventObject = await userOwnsEvent(userId, eventId);
    if (eventObject.status === 404) {
      return next(new NotFoundError('event not found'));
    }
    if (eventObject.status === 403) {
      return next(
        new ForbiddenError('You do not have access to edit this event')
      );
    }

    const response = await updateEventRow(eventId, {
      name,
      description,
      startDate,
      endDate,
      location,
    });

    res.status(200).json(response);
  } catch (err) {
    return next(new InternalServerError(err));
  }
}

// DELETE
async function deleteEvent(req, res, next) {
  const userId = req.params.userid;
  const eventId = req.params.eventid;

  try {
    const eventObject = await userOwnsEvent(userId, eventId);
    if (eventObject.status === 404) {
      return next(new NotFoundError('event not found'));
    }
    if (eventObject.status === 403) {
      return next(
        new ForbiddenError('You do not have access to manipulate this event')
      );
    }

    const response = await deleteEventById(eventId);
    console.log('successful delete');
    console.log(response);

    res.status(200).json(response);
  } catch (err) {
    return next(new InternalServerError(err));
  }
}

module.exports = { addEvent, getEventById, updateEvent, deleteEvent };
