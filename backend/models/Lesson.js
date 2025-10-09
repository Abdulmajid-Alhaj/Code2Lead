// Import mongoose library
const mongoose = require("mongoose");

// Define the schema for the "Lessons" collection
const LessonSchema = new mongoose.Schema(
    {
        // Reference to the chapter this lesson belongs to
        chapterId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Chapter",
            required: true,
        },

        // Lesson title
        title: {
            type: String,
            required: true,
            trim: true,
        },

        // Main content or body of the lesson
        content: {
            type: String,
            required: true,
            trim: true,
        },

        // Example or code snippet related to the lesson
        example: {
            type: String,
            default: "",
            trim: true,
        },

        // Order or position of the lesson within its chapter
        order: {
            type: Number,
            required: true,
        },

        // Optional reference to an exercise related to this lesson
        exerciseId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Exercise",
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

// Create and export the Lesson model
const Lesson = mongoose.model("Lesson", LessonSchema);
export default Lesson;