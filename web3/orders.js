const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all orders
router.get('/', async (req, res) => {
    try {
        const orders = await db.query('SELECT * FROM orders ORDER BY createdAt DESC');
        res.json(orders);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create new order
router.post('/', async (req, res) => {
    try {
        const { customer, items, total } = req.body;

        const result = await db.query(
            'INSERT INTO orders (customer, items, total, status) VALUES (?, ?, ?, ?)',
            [JSON.stringify(customer), JSON.stringify(items), total, 'pending']
        );

        res.status(201).json({
            orderId: result.insertId,
            message: 'Order created successfully'
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;