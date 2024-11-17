const express = require('express');
const router = express.Router();
const Grocery = require('../models/Grocery');

// Get all grocery lists for a user
router.get('/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        
        if (!userId) {
            return res.status(400).json({ error: 'User name is required' });
        }

        const groceries = await Grocery.find({ userId })
            .sort({ createdAt: -1 })
            .limit(1);
            
        console.log('Fetched groceries for user:', userId, groceries);
        res.status(200).json(groceries);
    } catch (error) {
        console.error('Error fetching grocery lists:', error);
        res.status(500).json({ error: 'Failed to fetch grocery lists', details: error.message });
    }
});

// Add a new grocery list
router.post('/', async (req, res) => {
    try {
        const { userId, items } = req.body;
        
        console.log('Received request:', { userId, items });

        // Validate userId
        if (!userId) {
            return res.status(400).json({ error: 'User name is required' });
        }

        // Validate items
        if (!Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ error: 'Items must be a non-empty array' });
        }

        // Find existing grocery list for the user
        let groceryList = await Grocery.findOne({ userId }).sort({ createdAt: -1 });

        if (groceryList) {
            groceryList.items.push(...items);
            await groceryList.save();
        } else {
            groceryList = new Grocery({ userId, items });
            await groceryList.save();
        }

        console.log('Saved grocery list:', groceryList);
        res.status(201).json(groceryList);
    } catch (error) {
        console.error('Error adding grocery list:', error);
        res.status(500).json({ error: 'Failed to add grocery list', details: error.message });
    }
});

module.exports = router;