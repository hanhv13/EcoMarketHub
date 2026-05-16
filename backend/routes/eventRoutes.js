const express = require('express');
const router  = express.Router();
const { getAllEvents, createEvent, deleteEvent } = require('../controllers/eventController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', getAllEvents);
router.post('/', authMiddleware, createEvent);
router.delete('/:id', authMiddleware, deleteEvent);

module.exports = router;
