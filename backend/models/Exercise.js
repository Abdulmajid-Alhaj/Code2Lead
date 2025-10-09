// Import mongoose library
const mongoose = require("mongoose");

// Define the schema for the "Exercise" collection
const ExerciseSchema = new mongoose.Schema(
    {
        // Reference to the lesson this exercise belongs to
        lesson_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Lesson", 
            required: true,
        },

        // Exercise title
        title: {
            type: String,
            required: true,
            trim: true,
        },

        // Description or instructions for the exercise
        description: {
            type: String,
            default: "",
            trim: true,
        },

        // Type of exercise (e.g., "quiz", "coding", "written")
        type: {
            type: String,
            required: true,
            enum: ["quiz", "coding"],
        },

        // Maximum score or points for this exercise
        maxScore: {
            type: Number,
            default: 100,
        },

        // The user (trainer/admin) who created this exercise
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User", 
            required: true,
        },
    },
    {
        timestamps: true, 
    }
);

// Create and export the Exercise model
const exercise = mongoose.model("Exercise", ExerciseSchema);
export default exercise