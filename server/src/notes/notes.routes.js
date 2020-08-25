const express = require('express');

const notesController = require('./notes.controller');

const router = express.Router();

router.get('/', notesController.getNotes);
router.post('/', notesController.createNote);
router.delete('/:id', notesController.deleteNote);

module.exports = router;
