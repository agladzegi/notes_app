const jwt = require('jsonwebtoken');

function notFound(req, res, next) {
  res.status(404);
  const error = new Error(`🔍 - Not Found - ${req.originalUrl}`);
  next(error);
}

function errorHandler(err, req, res, next) {
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? '✌' : err.stack,
  });
}

function checkTokenSetUser(req, res, next) {
  const header = req.get('Authorization');
  if (header) {
    const token = header.split(' ')[1];
    if (token) {
      jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
        if (err) {
          console.log(err);
        }

        req.user = user;
        next();
      });
    } else {
      next();
    }
  } else {
    next();
  }
}

function isLoggedIn(req, res, next) {
  if (req.user) {
    next();
  } else {
    unAuthorized(res, next);
  }
}

function unAuthorized(res, next) {
  const error = new Error('🔐 Not authorized 🔐');
  res.status(401);
  next(error);
}

module.exports = {
  notFound,
  errorHandler,
  checkTokenSetUser,
  isLoggedIn,
  unAuthorized,
};
