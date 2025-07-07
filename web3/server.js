const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api/products', require('./routes/products'));
app.use('/api/orders', require('./routes/orders'));

// Start server
db.connect().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}).catch(err => {
    console.error('Database connection failed', err);
    process.exit(1);
});

//routes
const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all products
router.get('/', async (req, res) => {
    try {
        const products = await db.query('SELECT * FROM products');
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get single product
router.get('/:id', async (req, res) => {
    try {
        const product = await db.query('SELECT * FROM products WHERE id = ?', [req.params.id]);
        if (product.length === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json(product[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create new product
router.post('/', async (req, res) => {
    try {
        const { name, category, price, description, image_url, featured } = req.body;
        const result = await db.query(
            'INSERT INTO products (name, category, price, description, image_url, featured) VALUES (?, ?, ?, ?, ?, ?)',
            [name, category, price, description, image_url, featured || false]
        );
        const newProduct = await db.query('SELECT * FROM products WHERE id = ?', [result.insertId]);
        res.status(201).json(newProduct[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update product
router.put('/:id', async (req, res) => {
    try {
        const { name, category, price, description, image_url, featured } = req.body;
        await db.query(
            'UPDATE products SET name = ?, category = ?, price = ?, description = ?, image_url = ?, featured = ? WHERE id = ?',
            [name, category, price, description, image_url, featured || false, req.params.id]
        );
        const updatedProduct = await db.query('SELECT * FROM products WHERE id = ?', [req.params.id]);
        res.json(updatedProduct[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete product
router.delete('/:id', async (req, res) => {
    try {
        await db.query('DELETE FROM products WHERE id = ?', [req.params.id]);
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;