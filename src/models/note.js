const mongoose = require("mongoose");

// define note's database schema
const noteSchema = new mongoose.Schema(
    {
        content: {
            type: String,
            required: true
        },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        favoriteCount: {
            type: Number,
            default: 0
        },
        favoritedBy: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }]
    },
    {
        // Assign createdAt and updatedAt fields with a Date type
        timestamps: true
    }
)

// use the schema to define the 'Note' model
const Note = mongoose.model('Note', noteSchema)

module.exports = Note;