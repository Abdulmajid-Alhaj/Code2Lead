const mongoose = require("mongoose");

const ChapterSchema = new mongoose.Schema(
    {
        // Reference to the course this chapter belongs to
        courseId: {
            type: mongoose.Schema.Types.ObjectId, 
            ref: "Course", 
            required: true,
        },

        // Chapter title
        title: {
            type: String,
            required: true,
            trim: true, 
        },

        // The order or position of this chapter in the course
        order: {
            type: Number,
            required: true,
        },

        // Short or detailed description of the chapter
        description: {
            type: String,
            default: "",
            trim: true,
        },

        // Array of lessons (can be linked to a Lesson model or stored as strings)
        Lessons: {
            type: [String], 
            default: [],
        },
    },
    {
        timestamps: true,
    }
);

const Chapter = mongoose.model("Chapter", ChapterSchema);
export default Chapter;