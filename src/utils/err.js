// - 400 Bad Request - This means that client-side input fails validation.
class BadRequestError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 400;
    this.name = 'BadRequestError';
  }
}

// - 401 Unauthorized - This means the user isn't not authorized to access a resource. It usually returns when the user isn't authenticated.
class UnauthorizedError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 401;
    this.name = 'UnauthorizedError';
  }
}

// - 403 Forbidden - This means the user is authenticated, but it's not allowed to access a resource.
class ForbiddenError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 403;
    this.name = 'ForbiddenError';
  }
}

// - 404 Not Found - This indicates that a resource is not found.
class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 404;
    this.name = 'NotFoundError';
  }
}

// - 500 Internal server error - This is a generic server error. It could be because prisma db search was not found.
class InternalServerError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 500;
    this.name = 'InternalServerError';
  }
}

module.exports = {
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  InternalServerError,
};
