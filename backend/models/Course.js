// Import mongoose library to define schema and model
const mongoose = require("mongoose");

// Define the schema for the "Courses" collection
const CourseSchema = new mongoose.Schema(
    {
        // You don't need to define it unless you want a custom id
        trainerId: {
            type: mongoose.Schema.Types.ObjectId, 
            ref: "User",
            required: true,
        },

        // Course title
        title: {
            type: String,
            required: true,
            trim: true,
        },

        // Short or detailed description of the course
        description: {
            type: String,
            required: true,
            trim: true,
        },

        // Slug (used for SEO-friendly URLs)
        slug: {
            type: String,
            unique: true, 
            required: true,
            lowercase: true, 
        },

        // Array of tags (for filtering or categorization)
        tags: {
            type: [String],
            default: [],
        },

        // Array of chapters or lessons
        chapters: {
            type: [String],
            default: [],
        },

        // URL of the course cover image
        coverUrl: {
            type: String,
            default: "", 
        },
    },
    {
        timestamps: true,
    }
);

// Create and export the Course model
const Course = mongoose.model("Course", CourseSchema);
export default Course;
