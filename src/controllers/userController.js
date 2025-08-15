const bcrypt = require('bcryptjs');
const {
  createUser,
  updateUser,
  getUserData,
  deleteUserEntry,
} = require('../models/user.model.js');
const { InternalServerError, BadRequestError } = require('../utils/err.js');

async function createNewUser(req, res, next) {
  const { username, first_name, last_name, password, confirm_pass } = req.body;

  console.log('we have a request to create user, ', username);
  if (password !== confirm_pass) {
    return next(new BadRequestError('Passwords must match!'));
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const response = await createUser({
      username,
      first_name,
      last_name,
      hash: hashedPassword,
    });

    console.log('user successfully created!', response);
    res.status(201).json(response);
  } catch (error) {
    return next(new InternalServerError(error.message));
  }
}

async function updateUserController(req, res, next) {
  // get the username, id, first/last name pass & conf pass from body
  const { id, username, first_name, last_name, password, confirm_pass } =
    req.body;

  if (password !== confirm_pass) {
    return next(new BadRequestError('passwords must match!'));
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const response = await updateUser(id, {
      username,
      first_name,
      last_name,
      hash: hashedPassword,
    });

    console.log('User successfully updated!', response);
    res.status(200).json(response);
  } catch (error) {
    return next(new InternalServerError(error.message));
  }
  // test w/ payload below:
  // curl -X PUT -H "Content-Type:application/json" http://localhost:5000/users -d '{"id":"3"
  // ,"username":"charlesvill","first_name":"Charles","last_name":"villa","password":"1234","confirm_pass":"1234"}'
}

// added token verification MW for testing JWT Autentication
async function readUserData(req, res, next) {
  const { id } = req.body;

  try {
    const response = await getUserData(id);

    res.status(200).json(response);
  } catch (err) {
    return next(new InternalServerError(err.message));
  }
}

async function deleteUser(req, user, next) {
  const { id } = req.body;

  try {
    const response = await deleteUserEntry(id);
    console.log('successful deletion!', response);
    res.status(200).json(response);
  } catch (err) {
    return next(new InternalServerError(err.message));
  }
}
module.exports = {
  createNewUser,
  updateUserController,
  readUserData,
  deleteUser,
};
