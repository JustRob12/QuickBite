const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Updated schema to include userId (name)
const mealSchema = new mongoose.Schema({
    date: String,
    userId: {
        type: String,
        required: true
    },
    meals: {
        breakfast: String,
        lunch: String,
        dinner: String,
        snack: String,
    },
});

const Meal = mongoose.model('Meal', mealSchema);

// Route to get all dates with meals for a specific user
router.get('/dates', async (req, res) => {
    try {
        const { userId } = req.query; // Get userId from query params
        if (!userId) {
            return res.status(400).json({ error: 'User name is required' });
        }

        const meals = await Meal.find({ userId }, 'date');
        const dates = meals.map(meal => meal.date);
        console.log(`Fetched dates for user ${userId}:`, dates);
        res.status(200).json(dates);
    } catch (error) {
        console.error('Error fetching meal dates:', error);
        res.status(500).json({ error: 'Error fetching meal dates' });
    }
});

// Route to get meals for a specific date and user
router.get('/:date', async (req, res) => {
    try {
        const { userId } = req.query; // Get userId from query params
        if (!userId) {
            return res.status(400).json({ error: 'User name is required' });
        }

        const meal = await Meal.findOne({ 
            date: req.params.date,
            userId
        });
        
        if (meal) {
            res.status(200).json(meal);
        } else {
            res.status(404).json({ message: 'No meals found for this date' });
        }
    } catch (error) {
        console.error('Error fetching meals:', error);
        res.status(500).json({ error: 'Error fetching meals' });
    }
});

// Route to save meals
router.post('/', async (req, res) => {
    try {
        const { date, meals, userId } = req.body;
        
        if (!userId) {
            return res.status(400).json({ error: 'User name is required' });
        }

        console.log(`Saving meals for user ${userId} on date ${date}:`, meals);

        const existingMeal = await Meal.findOne({ date, userId });
        if (existingMeal) {
            existingMeal.meals = meals;
            await existingMeal.save();
            return res.status(200).json(existingMeal);
        }

        const newMeal = new Meal({ date, meals, userId });
        await newMeal.save();
        res.status(201).json(newMeal);
    } catch (error) {
        console.error('Error saving meals:', error);
        res.status(500).json({ error: 'Error saving meals' });
    }
});

module.exports = router; 