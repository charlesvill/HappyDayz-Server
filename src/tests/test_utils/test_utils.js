const user = { username: 'fbaz123', password: '1234' };

function errorMiddleWare(err, req, res, next) {
  console.error(err);
  res
    .status(err.statusCode || 500)
    .send(err.name + ' ' + err.statusCode + ': ' + err.message);
}

module.exports = { user, errorMiddleWare };
