const mongoose = require('mongoose');

const grocerySchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    items: [
        {
            name: {
                type: String,
                required: true,
            },
            quantity: {
                type: Number,
                default: 1,
            },
        },
    ],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Grocery', grocerySchema);