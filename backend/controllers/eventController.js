// ============================================================
// FILE: backend/controllers/eventController.js
// FUNCTION: Handle logic related to events (GreenHub)
// ============================================================

const db = require('../config/db');

// Get list of events
const getAllEvents = async (req, res) => {
    try {
        const [events] = await db.query('SELECT e.*, u.username AS creator_name FROM events e JOIN users u ON e.user_id = u.id ORDER BY e.event_date ASC');
        res.json(events);
    } catch (error) {
        console.error('getAllEvents error:', error);
        res.status(500).json({ message: 'Server error while fetching events.' });
    }
};

// Create new event (Admin only)
const createEvent = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Only Admin can post events.' });
        }

        const { title, description, image_url, location, event_date } = req.body;

        if (!title || !event_date) {
            return res.status(400).json({ message: 'Please provide title and event date.' });
        }

        const [result] = await db.query(
            'INSERT INTO events (user_id, title, description, image_url, location, event_date) VALUES (?, ?, ?, ?, ?, ?)',
            [req.user.id, title, description, image_url, location, event_date]
        );

        res.status(201).json({ message: 'Event created successfully!', eventId: result.insertId });
    } catch (error) {
        console.error('createEvent error:', error);
        res.status(500).json({ message: 'Server error while creating event.' });
    }
};

// Delete event (Admin only)
const deleteEvent = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Only Admin can delete events.' });
        }

        const { id } = req.params;
        await db.query('DELETE FROM events WHERE id = ?', [id]);
        res.json({ message: 'Event deleted successfully!' });
    } catch (error) {
        console.error('deleteEvent error:', error);
        res.status(500).json({ message: 'Server error while deleting event.' });
    }
};

module.exports = { getAllEvents, createEvent, deleteEvent };
