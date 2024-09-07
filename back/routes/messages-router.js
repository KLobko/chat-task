const express = require('express');
const router = express.Router();
const Message = require('../models/Message');

// get all messages
router.get('/messages', async (req, res) => {
    try {
        const messages = await Message.find();
        res.json(messages);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// add new message
router.post('/messages', async (req, res) => {
    const message = new Message({
        name: req.body.name,
        message: req.body.message,
        date: req.body.date
    });

    try {
        const newMessage = await message.save();
        res.status(201).json(newMessage);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// edit message
router.put('/messages/:id', async (req, res) => {
    try {
        const message = await Message.findByIdAndUpdate(req.params.id, {
            name: req.body.name,
            message: req.body.message,
            date: req.body.date
        }, { new: true });

        if (!message) {
            return res.status(404).json({ message: 'Message not found' });
        }

        res.json(message);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;