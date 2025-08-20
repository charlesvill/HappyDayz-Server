const express = require('express');
const path = require('path');
const { NotFoundError } = require('./src/utils/err.js');
// const passport = require('./authentication/passport-config.js');
const userRouter = require('./src/routes/userRouter.js');
const authRouter = require('./src/routes/authRouter.js');
const eventRouter = require('./src/routes/eventRouter.js');
const pageRouter = require('./src/routes/pageRouter.js');

require('dotenv').config();
const cors = require('cors');

const PORT = process.env.PORT || 5000;

const app = express();
const assetsPath = path.join(__dirname, 'public');

app.use(express.static(assetsPath));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(passport.initialize());
app.use(cors());

app.get('/', (req, res) => {
  res.json({
    message: 'you are coming to us live from index',
  });
});

app.use('/user', userRouter);

app.use('/auth', authRouter);

app.use('/event', eventRouter);

app.use('/page', pageRouter);

app.use((req, res, next) => {
  return next(new NotFoundError(`404: Not Found! path: ${req.path}`));
});

app.use((err, req, res, next) => {
  console.error(err);
  res
    .status(err.statusCode || 500)
    .send(err.name + ' ' + err.statusCode + ': ' + err.message);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
