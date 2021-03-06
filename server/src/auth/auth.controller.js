const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const authSchema = require('./auth.schema');
const users = require('./auth.model');

const getUser = async (req, res, next) => {
  try {
    const user = await users.findOne({ _id: req.user._id }, '-password');

    res.json(user);
  } catch (error) {
    next(error);
  }
};

const register = async (req, res, next) => {
  const result = authSchema.schema.validateAsync(req.body);
  if (!result.error) {
    try {
      const user = await users.findOne({ email: req.body.email });

      if (user) {
        res.status(409);
        next(new Error('That email is already in use, please try another one'));
      }

      const hashed = await bcrypt.hashSync(req.body.password, 10);
      const newUser = {
        fullName: req.body.fullName,
        email: req.body.email,
        password: hashed,
      };

      const insertedUser = await users.insert(newUser);

      const payload = {
        _id: insertedUser._id,
      };

      jwt.sign(
        payload,
        process.env.TOKEN_SECRET,
        {
          expiresIn: '1h',
        },
        (err, token) => {
          if (err) {
            res.status(422);
            next(new Error('Unable to login'));
          } else {
            res.json({ token });
          }
        }
      );
    } catch (error) {
      res.status(500);
      next(error);
    }
  } else {
    res.status(422);
    next(result.error);
  }
};

const login = async (req, res, next) => {
  const result = authSchema.loginSchema.validateAsync(req.body);
  if (!result.error) {
    try {
      const user = await users.findOne({ email: req.body.email });

      if (!user) {
        const error = new Error('Unable to login');
        res.status(404);
        next(error);
      }

      const result = await bcrypt.compareSync(req.body.password, user.password);

      if (result) {
        const payload = {
          _id: user._id,
        };

        jwt.sign(
          payload,
          process.env.TOKEN_SECRET,
          {
            expiresIn: '1h',
          },
          (err, token) => {
            if (err) {
              res.status(422);
              next(new Error('Unable to login'));
            } else {
              res.json({ token });
            }
          }
        );
      } else {
        res.status(422);
        throw new Error('Unable to login');
      }
    } catch (error) {
      next(error);
    }
  } else {
    res.status(422);
    next(result.error);
  }
};

module.exports = {
  register,
  login,
  getUser,
};
