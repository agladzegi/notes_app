const notes = require('./notes.model');
const schema = require('./notes.schema');
const monk = require('monk');
const middlewares = require('../middlewares/middlewares');

const getNotes = async (req, res, next) => {
  try {
    const result = await notes.find({ user_id: req.user._id });

    res.json(result);
  } catch (error) {
    next(error);
  }
};

const createNote = async (req, res, next) => {
  const result = schema.validate(req.body);
  if (!result.error) {
    try {
      const note = {
        ...req.body,
        user_id: req.user._id,
      };

      const createdNote = await notes.insert(note);
      res.json(createdNote);
    } catch (error) {
      next(error);
    }
  } else {
    res.status(422);
    next(new Error(result.error));
  }
};

const deleteNote = async (req, res, next) => {
  try {
    const note = await notes.findOne({ _id: req.params.id });

    if (!note) {
      const error = new Error('Note not found 🔎');
      res.status(404);
      next(error);
    }

    if (note.user_id !== req.user._id) {
      middlewares.unAuthorized;
    }

    await notes.findOneAndDelete({ _id: req.params.id });

    res.json({ message: 'Note removed ✔' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getNotes,
  createNote,
  deleteNote,
};
